const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userModel);
module.exports = user;
