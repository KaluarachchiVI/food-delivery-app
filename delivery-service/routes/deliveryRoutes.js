// routes/deliveryRoutes.js

import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import {
    assignDelivery,
    getDeliveryStatus,
    updateDeliveryStatus,
} from "../controllers/deliveryController.js";
import { findNearestDriver } from "../controllers/deliveryController.js";


const router = express.Router();

// Assign a delivery person to an order (restaurant role only)
router.post(
    "/assign",
    authenticate,

    assignDelivery
);

// Get the status of a delivery (anyone can check)
router.get("/status/:orderId", getDeliveryStatus);

// Update the delivery status (restaurant role only)
router.put(
    "/status/:orderId",
    authenticate,

    updateDeliveryStatus
);

router.post("/find-nearest", authenticate, async (req, res) => {
    try {
        const driverId = await findNearestDriver(req.body.restaurantLocation);
        if (!driverId) return res.status(404).json({ message: "No available drivers nearby" });
        res.json({ driverId });
    } catch (error) {
        res.status(500).json({ message: "Failed to find nearest driver", error: error.message });
    }
});


export default router;
