import dotenv from 'dotenv';
dotenv.config();

export const initiatePayment = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            order_id,
            items,
            amount
        } = req.body;

        const paymentData = {
            merchant_id: process.env.PAYHERE_MERCHANT_ID,
            return_url: process.env.PAYHERE_RETURN_URL,
            cancel_url: process.env.PAYHERE_CANCEL_URL,
            notify_url: process.env.PAYHERE_NOTIFY_URL,
            order_id: order_id,
            items: items,
            amount: amount,
            currency: "LKR",
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            country: "Sri Lanka",
        };

        res.status(200).json({
            success: true,
            message: "Payment data ready",
            redirectUrl: "https://sandbox.payhere.lk/pay/checkout",
            formData: paymentData
        });
    } catch (error) {
        console.error("Payment initiation error:", error);
        res.status(500).json({
            success: false,
            message: "Payment initiation failed",
            error: error.message,
        });
    }
};

export const handleNotify = async (req, res) => {
    const { order_id, payment_status, md5sig } = req.body;

    try {
        if (payment_status === "Completed") {
            // Here you can verify the signature (md5sig) if you want extra security

            await Order.findOneAndUpdate(
                { orderId: order_id },
                { status: "paid" }
            );

            res.status(200).send("Payment status updated successfully");
        } else {
            // Payment not completed
            await Order.findOneAndUpdate(
                { orderId: order_id },
                { status: "payment_failed" }
            );

            res.status(200).send("Payment failed or canceled");
        }
    } catch (err) {
        console.error("Payment notification handling failed:", err);
        res.status(500).send("Failed to update order status");
    }
};
