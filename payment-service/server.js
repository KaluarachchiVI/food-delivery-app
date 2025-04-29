import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Payment service running on port ${process.env.PORT}`);
});
