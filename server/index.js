const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");
const { createServer, METHODS } = require("http");

const { v4: uuid } = require("uuid");

const { v2: cloudnary } = require("cloudinary");

const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require("./constants/events");
const { socketAuthenticator } = require("./middlewares/auth");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Message = require("./model/messageModel");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

require("dotenv").config();

app.use(cors(corsOptions));

app.use(express.json()); //middleware parses the JSON data
app.use(cookieParser());

// app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

cloudnary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

app.use("/api/auth/user", userRoutes);
app.use("/api/chat", chatRoutes);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.resume, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

const userSocketIDs = new Map();

const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user.toString()));
  return sockets;
};

io.on("connection", (socket) => {
  const user = socket.user;

  userSocketIDs.set(user?._id?.toString(), socket?.id);

  console.log("User Connected", socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealtime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user?._id,
        name: user?.name,
        avatar: user?.avata?.url,
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

    io.to(userSocketsActive).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });

    await Message.create(messageForDB);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected", socket.id);
    userSocketIDs?.delete(user?._id?.toString());
  });
});

server.listen(process.env.PORT, () => {
  console.log(
    `Server started on ${process.env.PORT} in ${process.env.NODE_ENV} Mode`
  );
});

module.exports = userSocketIDs;

// createUser(10);

// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("661a19d630dd1234540672a1", 10);

// const {
//   createUser,
//   createGroupChats,
//   createSingleChats,
//   createMessagesInAChat,
// } = require("./seeders/chatSeeders");
