// controllers/deliveryController.js

import Delivery from "../models/deliveryModel.js";
import Order from "../models/Order.js"; // Assuming you have an Order model
import axios from 'axios';
// Assign delivery person to order
export const assignDelivery = async (req, res) => {
    const { orderId, deliveryPersonId } = req.body;

    try {
        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Create new delivery
        const newDelivery = new Delivery({
            orderId,
            deliveryPersonId,
            restaurantId: order.restaurantId, // Assuming order has restaurantId
        });

        const savedDelivery = await newDelivery.save();
        res.status(201).json({ message: "Delivery assigned", delivery: savedDelivery });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign delivery", error: error.message });
    }
};

// Get delivery status
export const getDeliveryStatus = async (req, res) => {
    const { orderId } = req.params;

    try {
        const delivery = await Delivery.findOne({ orderId });
        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }
        res.json({ delivery });
    } catch (error) {
        res.status(500).json({ message: "Failed to get delivery status", error: error.message });
    }
};

import { io } from "../server.js";

// Update delivery status (e.g., In Progress, Delivered)
export const updateDeliveryStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const delivery = await Delivery.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );

        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        // Emit the updated delivery status to all connected clients
        io.emit("deliveryStatusUpdated", delivery);

        res.json({ message: "Delivery status updated", delivery });
    } catch (error) {
        res.status(500).json({ message: "Failed to update delivery status", error: error.message });
    }
};

export const notifyDeliveryStatus = async (customerId, fcmToken, status) => {
    const message = `Your delivery is now ${status}`;
    await axios.post('http://localhost:5004/api/notifications/send', {
        title: 'Delivery Status',
        message,
        recipientRole: 'customer',
        userId: customerId,
        fcmToken,
    });
};

export const findNearestDriver = async (restaurantLocation) => {
    const drivers = await User.aggregate([
        {
            $match: {
                role: 'delivery',
                isAvailable: true,
            },
        },
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: restaurantLocation.coordinates,
                },
                distanceField: 'distance',
                spherical: true,
                maxDistance: 10000, // 10km radius
            },
        },
        { $sort: { distance: 1 } }, // Nearest first
        { $limit: 1 }, // Get closest driver
    ]);

    return drivers[0]?._id; // Return closest driver's ID
};