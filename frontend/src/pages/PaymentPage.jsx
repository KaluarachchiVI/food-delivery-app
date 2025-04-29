import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";

const BASE_URL = 'http://localhost:5003'

const PaymentPage = () => {
    const [payhereLoaded, setPayhereLoaded] = useState(false);
    const { cartItems } = useCart();  // Get cart items from context
    const [orderStatus, setOrderStatus] = useState('');
    const [deliveryDetails, setDeliveryDetails] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
    });

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);  // Calculate total amount
    const itemNames = cartItems.map(item => `${item.name} x${item.quantity}`).join(", ");  // Format item names for PayHere

    // Load PayHere SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.payhere.lk/lib/payhere.js";
        script.async = true;
        script.onload = () => {
            setPayhereLoaded(!!window.payhere);  // Check if PayHere SDK is loaded
            console.log("PayHere SDK loaded");
        };
        script.onerror = () => console.error("Failed to load PayHere script.");
        document.body.appendChild(script);

        return () => document.body.removeChild(script);  // Cleanup the script on component unmount
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Create an order object
    const order = {
        id: `ORDER-${Date.now()}`,  // Generate a unique order ID
        items: itemNames,
        totalAmount: totalAmount,
    };

    // Set a hardcoded delivery person ID (you can replace this with actual logic)
    const deliveryPersonId = "DELIVERY_PERSON_123";  // This should be dynamically assigned in a real scenario

    const confirmPayment = async (event) => {
        event.preventDefault(); // Prevents the default form submission

        // Assuming you already have the order ID or other necessary details:
        try {
            const response = await axios.post("http://localhost:5003/api/payment/confirm-payment", {
                orderId: order.id,
                paymentStatus: 'success', // Ensure this is dynamically passed
            });

            if (response.status === 200) {
                // After payment confirmation, update order status and delivery details
                setOrderStatus('Paid');

                // Now assign delivery and update the delivery details
                const deliveryResponse = await axios.post('http://localhost:5005/api/delivery/assign', {
                    orderId: order.id,
                    deliveryPersonId: deliveryPersonId, // Pass the delivery person's ID
                });

                if (deliveryResponse.status === 200) {
                    setDeliveryDetails(deliveryResponse.data.delivery); // Save the delivery details in the state
                    console.log('Payment confirmed and delivery assigned.');
                    // Show success message, navigate, or update the UI
                } else {
                    console.error('Failed to assign delivery', deliveryResponse.data);
                }
            } else {
                console.error('Payment failed', response.data);
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
        }
    };

    // Handle payment
    const payNow = async () => {
        if (!payhereLoaded) {
            console.error("PayHere SDK is not ready.");
            alert("Payment system is not ready yet!");
            return;
        }

        try {
            // Make a POST request to your backend to get the payment data
            const response = await axios.post("http://localhost:5003/api/payment/create", {
                ...formData,  // Send user details from form
                order_id: order.id,  // Use the generated order ID
                items: itemNames,  // Send item names and quantities
                amount: totalAmount,  // Send total amount to be paid
            });

            const { formData: payhereData } = response.data;  // Extract payment data from response

            console.log("PayHere data:", payhereData);  // For debugging

            // Start the PayHere payment process
            if (window.payhere) {
                window.payhere.startPayment(payhereData);
            } else {
                console.error("PayHere SDK not found!");
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Payment initiation failed. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <h2>Customer Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); payNow(); }}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                /><br /><br />

                <h3>Order Summary</h3>
                <p><strong>Items:</strong> {itemNames}</p>
                <p><strong>Total:</strong> Rs. {totalAmount}</p>

                <button type="submit" disabled={!cartItems.length} onClick={confirmPayment}>Pay Now</button>
            </form>
        </div>
    );
};

export default PaymentPage;
