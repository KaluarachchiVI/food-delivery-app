import { useEffect, useState } from "react";
import axios from "axios";

const PaymentPage = () => {
    const [payhereLoaded, setPayhereLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.payhere.lk/lib/payhere.js";
        script.async = true;
        script.onload = () => {
            if (window.payhere) {
                setPayhereLoaded(true);
            } else {
                console.error("PayHere SDK failed to load!");
            }
        };
        script.onerror = () => {
            console.error("Failed to load PayHere script.");
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const payNow = async () => {
        if (!payhereLoaded) {
            alert("Payment system is not ready yet!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5003/api/payment/create", {
                first_name: "John",
                last_name: "Doe",
                email: "john@example.com",
                phone: "0771234567",
                address: "No.1, Galle Road",
                city: "Colombo",
                order_id: "ORDER12345",
                items: "Sample Item",
                amount: "1500.00",
            });

            const { redirectUrl, formData } = response.data;

            if (!window.payhere) {
                console.error("PayHere SDK not available when trying to pay.");
                return;
            }

            // 👇 Remove .init() — not needed for popup
            // window.payhere.init(formData.merchant_id);

            // Directly start the payment
            window.payhere.startPayment(formData);

        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Payment initiation failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>PayHere Payment</h2>
            <button onClick={payNow}>Pay Now</button>
        </div>
    );
};

export default PaymentPage;

// create a form to get the data actually
