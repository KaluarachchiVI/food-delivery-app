const Order = require("../models/Order");
const axios = require("axios")
const Restaurant = require("../models/Restaurant");


const placeOrder = async (req, res) => {
    try {
        const { restaurantId, items } = req.body;

        // 1. Get restaurant location
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error("Restaurant not found");

        // 2. Find nearest available driver


        const deliveryServiceURL = "http://localhost:5003";

        const findNearestDriver = async (restaurantLocation) => {
            const { data } = await axios.post(`${deliveryServiceURL}/api/delivery/find-nearest`, { restaurantLocation });
            return data.driverId;
        };

        const deliveryPersonId = await findNearestDriver(restaurant.location);
        if (!deliveryPersonId) throw new Error("No available delivery drivers nearby");

        // 3. Create order with auto-assigned driver
        const order = await Order.create({
            customerId: req.user.id,
            restaurantId,
            items,
            deliveryPerson: deliveryPersonId,
            status: 'assigned',
        });

        // 4. Mark driver as unavailable
        await User.findByIdAndUpdate(deliveryPersonId, { isAvailable: false });

        res.status(201).json({ order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error: error.message });
    }
};

const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const sendNotification = async (userId, fcmToken, message) => {
    await axios.post('http://localhost:5004/api/notifications/send', {
        title: 'Order Update',
        message,
        recipientRole: 'customer',
        userId,
        fcmToken,
    });
};

// Function to send order confirmation to customer (via email)
const sendOrderConfirmation = async (customerEmail, orderDetails) => {
    const subject = `Order Confirmation - Order #${orderDetails._id}`;
    const text = `
        Thank you for your order!\n\n
        Order Details:\n
        - Items: ${orderDetails.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}\n
        - Total Price: ${orderDetails.totalPrice}\n
        - Order Status: ${orderDetails.status}\n
        - Estimated Delivery Time: 45 minutes\n\n
        We will notify you once your order is on its way.`;

    try {
        await sendEmail(customerEmail, subject, text);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

// Function to send notification to the delivery person (via FCM)
const notifyDeliveryPersonnel = async (fcmToken, orderDetails) => {
    const message = {
        notification: {
            title: `New Delivery Order: #${orderDetails._id}`,
            body: `A new delivery is available. Order details: ${orderDetails.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}.`,
        },
        token: fcmToken, // Delivery person's FCM token
    };

    try {
        await admin.messaging().send(message);
        console.log('Push notification sent to delivery personnel');
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

// Modify order (before confirmation)
const modifyOrder = async (req, res) => {
    const { orderId, items } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.isConfirmed) throw new Error("Order already confirmed");

    order.items = items;
    await order.save();

    res.json({ order });
};

// Restaurant confirms order (locking modifications)
const confirmOrder = async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findByIdAndUpdate(
        orderId,
        { isConfirmed: true, status: "preparing" },
        { new: true }
    );

    res.json({ order });
};




module.exports = { placeOrder, updateOrderStatus, getCustomerOrders, sendNotification, modifyOrder, confirmOrder, sendOrderConfirmation, notifyDeliveryPersonnel };
