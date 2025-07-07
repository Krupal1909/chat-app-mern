const express = require("express");
const router = express.Router();
const {
  getUser,
  signin,
  signout,
  signup,
  updateProfile,
} = require("../controller/user.controller");
const isAuthenticated = require('../middleware/auth.middleware')


router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/sign-out", isAuthenticated, signout);
router.get("/me",isAuthenticated ,getUser);
router.put("/updateProfile", isAuthenticated ,updateProfile);

module.exports = router;
