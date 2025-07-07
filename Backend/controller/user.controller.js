const catchAsyncError = require("../middleware/catchAsyncError");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const geneRateJWTToken = require("../utills/jwt.token");
const cloudinary = require("cloudinary").v2;
const signup = catchAsyncError(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "please provide all fields",
    });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "please provide valid email",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "password should be greater than 8 characters",
    });
  }
  const isEmailAlreadyUsed = await userModel.findOne({ email: email });
  if (isEmailAlreadyUsed) {
    return res.status(400).json({
      success: false,
      message: "email is already in used",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "",
      url: "",
    },
  });
  geneRateJWTToken(user, "user Registered successfully", 201, res);
});

const signin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "please fill all required fields",
    });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "please provide valid email",
    });
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "user not found",
    });
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return res.status(400).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
  geneRateJWTToken(user, "login successful", 201, res);
});

const signout = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: process.env.NODE_ENV != "development" ? true : false,
    })
    .json({
      success: true,
      message: "logout successfully",
    });
});
const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  return res.status(201).json({
    success: true,
    user,
  });
});

const updateProfile = catchAsyncError(async (req, res, next) => {
  const { fullName, email } = req.body;
  if (fullName.trim().length === 0 || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "please provide valid fields",
    });
  }
  const avatar = req?.files?.avatar;
  let cloudinaryRes = {};
  if (avatar) {
    try {
      const oldPublicId = req?.user?.avatar?.public_id;
      if (oldPublicId && oldPublicId.length > 0) {
        await cloudinary.uploader.destroy(oldPublicId);
      }

      cloudinaryRes = await cloudinary.uploader.upload(avatar.tempFilePath, {
        folder: "CHAT_APP_USERS_AVATARS",
        transformation: [
          { width: 300, height: 300, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({
        success: false,
        message: "error while updating profile image",
      });
    }
  }

  let data = {
    fullName,
    email,
  };

  if (avatar && cloudinaryRes?.public_id && cloudinaryRes?.secure_url) {
    data.avatar = {
      public_id: cloudinaryRes.public_id,
      url: cloudinaryRes.secure_url,
    };
  }

  let user = await userModel.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "user Profile Updated successfully",
    user,
  });
});

module.exports = {
  signin,
  getUser,
  signout,
  signup,
  updateProfile,
};
