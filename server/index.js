const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const { Server } = require("socket.io");
const { createServer } = require("http");

const {
  createUser,
  createGroupChats,
  createSingleChats,
  createMessagesInAChat,
} = require("./seeders/chatSeeders");
const { create } = require("./model/userModel");

const app = express();
const server = createServer(app);
const io = new Server(server, {});

require("dotenv").config();

app.use(cors());
app.use(express.json()); //middleware parses the JSON data
app.use(cookieParser());

// app.use(express.urlencoded({ extended: false }));
app.use("/api/auth/user", userRoutes);
app.use("/api/chat", chatRoutes);

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

// createUser(10);

// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat("661a19d630dd1234540672a1", 10);

// app.use("/api/auth", userRoutes);

io.on("connection", (socket) => {
  socket.on("connection", () => {
    console.log("User Connected", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(
    `Server started on ${process.env.PORT} in ${process.env.NODE_ENV} Mode`
  );
});
