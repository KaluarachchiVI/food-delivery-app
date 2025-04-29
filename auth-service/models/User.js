// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google users
    googleId: { type: String },  // optional for Google users
    role: { type: String, enum: ["customer", "restaurant", "delivery"], default: "customer" },
    fcmToken: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    isAvailable: { type: Boolean, default: true }, // For delivery personnel
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("User", userSchema);
