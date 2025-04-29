const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [{ name: String, quantity: Number, price: Number }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Example: Pending, In Progress, Completed
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to delivery personnel
    fcmToken: { type: String }, // FCM Token for push notifications
    isConfirmed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
