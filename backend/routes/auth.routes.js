const express = require("express");
const auth = require("../middleware/auth.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/me", auth, authController.getMe);
router.put("/me", auth, authController.updateMe);

module.exports = router;
