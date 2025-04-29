// deliveryService.js
import Order from '../models/orderModel.js'; // Assuming there's a shared order model or replicated copy
import Delivery from '../models/deliveryModel.js'; // Model for tracking delivery updates

// Get all deliveries assigned to a specific delivery personnel
export const getAssignedDeliveries = async (deliveryPersonId) => {
    return await Delivery.find({ deliveryPerson: deliveryPersonId }).populate('order');
};

// Update delivery status for a specific order
export const updateDeliveryStatus = async (orderId, status) => {
    const delivery = await Delivery.findOne({ order: orderId });
    if (!delivery) {
        throw new Error('Delivery not found for this order');
    }
    delivery.status = status;
    delivery.updatedAt = new Date();
    await delivery.save();

    // Optionally update order status too
    const order = await Order.findById(orderId);
    if (order) {
        order.deliveryStatus = status;
        await order.save();
    }

    return delivery;
};

// Assign a delivery person to an order (used by restaurant or system)
export const assignDeliveryPerson = async (orderId, deliveryPersonId) => {
    const delivery = new Delivery({
        order: orderId,
        deliveryPerson: deliveryPersonId,
        status: 'assigned',
    });

    await delivery.save();

    const order = await Order.findById(orderId);
    if (order) {
        order.deliveryStatus = 'assigned';
        await order.save();
    }

    return delivery;
};
