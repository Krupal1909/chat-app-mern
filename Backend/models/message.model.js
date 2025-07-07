const mongoose = require("mongoose");

const messageModel = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    media: String,
  },
  { timestamps: true }
);

const message = mongoose.model("Message", messageModel);
module.exports = message;
