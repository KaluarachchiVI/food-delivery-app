import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import restaurantRoutes from "./routes/restaurantRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/restaurant", restaurantRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("🍽️ Restaurant Service DB connected");
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Restaurant Service running on port ${process.env.PORT}`);
    });
}).catch(err => console.error("MongoDB connection failed", err));
