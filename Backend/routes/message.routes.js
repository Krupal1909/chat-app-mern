const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getMessages,
  sendMessage,
} = require("../controller/message.controller");
const isAuthenticated = require("../middleware/auth.middleware");

router.get("/getUsers", isAuthenticated, getAllUsers);
router.get("/getMessages/:id", isAuthenticated, getMessages);
router.post("/sendMessage/:id", isAuthenticated, sendMessage);

module.exports = router;
