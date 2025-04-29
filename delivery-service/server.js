// server.js

import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import { authenticate } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

// Create an Express app
const app = express();

// Create an HTTP server to integrate with Socket.io
const server = http.createServer(app);

// Create Socket.io instance
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (adjust in production)
        methods: ["GET", "POST"],
    },
});

// Middleware to parse JSON
app.use(express.json());

// Use the delivery routes
app.use("/api/delivery", deliveryRoutes);

// WebSocket connection handler
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for delivery status updates
    socket.on("deliveryStatusUpdated", (deliveryData) => {
        // Emit the updated delivery status to all connected clients
        io.emit("deliveryStatusUpdate", deliveryData);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

connectDB();

// Export io and server
export { io, server };

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
    console.log(`🚚 Delivery Service running on port ${PORT}`);
});


export default app;
