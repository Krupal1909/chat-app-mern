const catchAsyncError = require("../middleware/catchAsyncError");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");
const { getReceivedSocketId } = require("../utills/socket.io");
const cloudinary = require("cloudinary").v2;

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const filterUser = await userModel
    .find({ _id: { $ne: user } })
    .select("-password");
  return res.status(200).json({
    success: true,
    users: filterUser,
  });
});

const getMessages = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;
  const myId = req.user._id;
  const receiver = await userModel.findById(receiverId);
  if (!receiver) {
    return res.status(400).json({
      success: false,
      message: "Receiver Id Invalid",
    });
  }
  const message = await messageModel
    .find({
      $or: [
        {
          senderId: myId,
          receiverId: receiverId,
        },
        {
          receiverId: myId,
          senderId: receiverId,
        },
      ],
    })
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message,
  });
});

const sendMessage = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const file = req?.files?.media;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  const receiver = await messageModel.findById(receiverId);
  if (!receiver) {
    return res.status(400).json({
      success: false,
      message: "Invalid receiver Id",
    });
  }
  const sanitizedText = text?.trim() || "";
  if (!sanitizedText && !media) {
    return res.status(400).json({
      success: false,
      message: "Can not send empty message",
    });
  }
  let mediaUrl = "";
  if (media) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(
        media.tempFilePath,
        {
          resource_type: "auto",
          folder: "CHAT_APP_MEDIA",
          transformation: [
            {
              width: 1080,
              height: 1080,
              crop: "limit",
            },
            {
              quality: "auto",
            },
            {
              fetch_format: "auto",
            },
          ],
        }
      );
      mediaUrl = uploadResponse?.secure_url;
    } catch (error) {
      console.log("error");
      return res.status(400).json({
        success: false,
        message: "failed to upload avatar",
      });
    }
  }

  const newMessages = await messageModel.create({
          senderId,
          receiverId,
          text : sanitizedText,
          media : mediaUrl
  })

  const receiverSocketId = getReceivedSocketId(receiverId);
  if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage", newMessages)
  }
  res.status(201).json(newMessages)
});

module.exports = {
  getAllUsers,
  getMessages,
  sendMessage,
};
