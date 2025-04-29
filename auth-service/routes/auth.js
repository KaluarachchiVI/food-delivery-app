// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { googleLogin, register, login } = require("../controllers/authController");

// Routes
router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
