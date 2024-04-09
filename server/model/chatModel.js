const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creater: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
