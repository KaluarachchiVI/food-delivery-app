const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    recipientRole: String,
    userId: String,
    sent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);

