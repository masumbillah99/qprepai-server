const { getDb } = require("../dtbase/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register new user
async function registerUser(req, res) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid request" });
  }
  const { fullName, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }
  try {
    const db = getDb();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    await db.collection("users").insertOne({ fullName, email, password });

    // create JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d", // 1 day
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
}

// Login user
async function loginUser(req, res) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid request" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }
  try {
    const db = getDb();
    const user = await db.collection("users").findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "email or password envalid" });
    } else {
      // create JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d", // 1 day
      });

      // Set the token in a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/",
      });
    }

    res.json({ message: "user login successfully" });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

module.exports = { registerUser, loginUser };
