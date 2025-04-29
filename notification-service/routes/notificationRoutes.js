const express = require('express');
const router = express.Router();
const { sendEmail, sendSMS } = require('../controllers/notificationController');

// Route to send a test email
router.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;
    await sendEmail(to, subject, message);
    res.send('Email sent!');
});

// Route to simulate sending SMS
router.post('/send-sms', (req, res) => {
    const { phoneNumber, message } = req.body;
    sendSMS(phoneNumber, message);
    res.send('SMS simulated!');
});

module.exports = router;
