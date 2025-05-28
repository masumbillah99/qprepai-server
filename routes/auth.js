const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  profile,
} = require("../controllers/authController");

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// get user profile
router.get("/profile", profile);

module.exports = router;
