const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const JWT_SECRET = process.env.JWT_SECRET || "passiton-secret";
const JWT_EXPIRES = "7d";

const createToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = createToken(user);
    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to register user." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user);
    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to login." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with that email." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load profile." });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: user._id },
    });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Email is already used by another account." });
    }

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    await user.save();

    return res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update profile." });
  }
};
