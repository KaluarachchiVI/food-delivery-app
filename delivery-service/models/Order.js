
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Restaurant",
        },
        items: [
            {
                name: String,
                quantity: Number,
                price: Number,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "preparing", "on the way", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
