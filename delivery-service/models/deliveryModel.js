// models/deliveryModel.js

import mongoose from "mongoose";

const deliverySchema = mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        deliveryPersonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming delivery person is a User
            required: true,
        },
        status: {
            type: String,
            enum: ["Assigned", "In Progress", "Delivered"],
            default: "Assigned",
        },
    },
    { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
