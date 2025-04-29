const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");          // ⬅️ 1. Import http
const { Server } = require("socket.io"); // ⬅️ 2. Import socket.io

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// 3. Create HTTP server
const server = http.createServer(app);

// 4. Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace * with your frontend URL
        methods: ["GET", "POST"]
    }
});

// 5. Make io globally accessible inside app
app.set('io', io);

// 6. Setup Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join room for order updates
    socket.on('joinOrderRoom', ({ orderId }) => {
        console.log(`Socket ${socket.id} joining room ${orderId}`);
        socket.join(orderId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// 7. Connect MongoDB and Start the HTTP+WebSocket Server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(process.env.PORT, () =>
            console.log(`Order service running on port ${process.env.PORT}`)
        );
    })
    .catch((err) => console.error("MongoDB connection failed", err));
