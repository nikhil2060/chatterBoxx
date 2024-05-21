const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

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
    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
