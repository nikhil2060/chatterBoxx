const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");
const { createServer } = require("http");

const { v4: uuid } = require("uuid");

const { v2: cloudinary } = require("cloudinary");

const {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPING,
  STOP_TYPING,
} = require("./constants/events");
const { socketAuthenticator } = require("./middlewares/auth");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Message = require("./model/messageModel");
const { userSocketIDs, getSockets } = require("./lib/helper");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
    "https://chatter-box-by-nikhil.vercel.app/",
    "https://chatter-box-by-nikhil.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.set("io", io);

require("dotenv").config();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://ChatterBox:ChatterBox@clusterchatterboxx.lusf8kx.mongodb.net",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    }
  )
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

cloudinary.config({
  cloud_name: "dbytcal0x",
  api_key: "337164424933638",
  api_secret: "GhwjAADdQNDn8VHDs6Y_9Igj4HM",
});

app.use("/api/auth/user", userRoutes);
app.use("/api/chat", chatRoutes);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;

  if (user) {
    userSocketIDs.set(user._id.toString(), socket.id);
    console.log("User Connected", socket.id);

    socket.on(START_TYPING, ({ members, chatId }) => {
      const membersSocket = getSockets(members);
      socket.to(membersSocket).emit(START_TYPING, { chatId });
    });

    socket.on(STOP_TYPING, ({ members, chatId }) => {
      const membersSocket = getSockets(members);
      socket.to(membersSocket).emit(STOP_TYPING, { chatId });
    });

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
      const messageForRealtime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar?.url, // Check your user model for the correct field
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const userSocketsActive = getSockets(members);

      io.to(userSocketsActive).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealtime,
      });

      socket.broadcast.to(userSocketsActive).emit(NEW_MESSAGE_ALERT, {
        chatId,
      });

      try {
        await Message.create(messageForDB);
      } catch (error) {
        console.error("Error saving message to DB:", error);
      }
    });

    socket.on("disconnect", () => {
      userSocketIDs.delete(user._id.toString());
      console.log("User disconnected", socket.id);
    });
  }
});

server.listen(process.env.PORT, () => {
  console.log(
    `Server started on ${process.env.PORT} in ${process.env.NODE_ENV} Mode`
  );
});
