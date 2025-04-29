// backend/controllers/authController.js
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { response } = require("express");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login
exports.googleLogin = async (req, res) => {
    const { tokenId, role, fcmToken, location } = req.body;  // Include location in the request body

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Ensure location is passed and is in the correct format
            const { coordinates, type } = location || {}; // Default to empty if not provided

            // If location data exists, validate and format it
            if (coordinates && coordinates.length === 2) {
                user = await User.create({
                    name,
                    email,
                    googleId: sub,
                    role,
                    location: {
                        type: "Point",
                        coordinates: coordinates,
                    },
                });
            } else {
                // If location is missing or malformed, omit it
                user = await User.create({ name, email, googleId: sub, role });
            }
        }

        // Update FCM token if provided
        if (fcmToken) {
            user.fcmToken = fcmToken;
            await user.save();  // Save the FCM token to the user
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login success", token, user });
    } catch (err) {
        res.status(400).json({ message: "Google Sign-In failed", error: err.message });
    }
};


exports.register = async (req, res) => {
    const { name, email, password, role, location } = req.body;

    // Log received request body to debug further
    console.log("Received registration data:", req.body);

    if (!password) {
        console.log("Password is missing in the request");
        return res.status(400).json({ message: "Password is required" });
    }

    if (typeof password !== 'string' || password.trim() === '') {
        console.log("Password is invalid:", password);
        return res.status(400).json({ message: "Password must be a valid string" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);  // This will show the result of bcrypt.hash()

        let user = await User.findOne({ email });
        if (user) {
            console.log("User already exists with this email");
            return res.status(400).json({ message: "Email already exists" });
        }

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            location, // Ensure location is passed correctly
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({ message: "Registration success", token, user });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};




// Login (email/password)
exports.login = async (req, res) => {
    const { email, password, fcmToken, location } = req.body;  // Include fcmToken

    console.log("Received login data:", req.body);

    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (location) {
            user.location = location;  // Update location if passed in the request
            await user.save();
        }

        // Save the FCM token if provided
        if (fcmToken) {
            user.fcmToken = fcmToken;
            await user.save();
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

