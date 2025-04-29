const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
        // Start the server after successful DB connection
        const PORT = process.env.PORT || 5004;
        app.listen(PORT, () => {
            console.log(`Notification service running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
