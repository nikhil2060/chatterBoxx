const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: String,
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
    attachments: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
