const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
    placeOrder,
    updateOrderStatus,
    modifyOrder,
    getCustomerOrders,
    confirmOrder,
} = require("../controllers/orderController");

router.post("/orders", authenticate, placeOrder);
router.put("/:id", authenticate, updateOrderStatus);
router.get("/", authenticate, getCustomerOrders);
router.patch("/:orderId/modify", authenticate, modifyOrder);
router.post("/:orderId/confirm", authenticate, confirmOrder);

router.post('/update-status', async (req, res) => {
    const { orderId, newStatus } = req.body;

    try {
        const order = await Order.findOneAndUpdate(
            { orderId },
            { status: newStatus },
            { new: true }
        );

        if (order) {
            const io = req.app.get('io'); // 👈 get io from app

            // Emit the new status to everyone tracking this order
            io.to(orderId).emit('deliveryStatusUpdated', {
                orderId: orderId,
                newStatus: newStatus,
            });

            res.status(200).json({ success: true, order });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
