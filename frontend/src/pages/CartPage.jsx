import React from "react";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Box
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = () => {
        // Redirect to payment with cart items
        navigate("/payment-dashboard", { state: { cartItems, total } });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom mt={4}>Your Cart</Typography>

            {cartItems.length === 0 ? (
                <Typography variant="body1">Your cart is empty.</Typography>
            ) : (
                <>
                    <List>
                        {cartItems.map((item, index) => (
                            <ListItem key={index}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => removeFromCart(item._id)}>
                                        <Delete />
                                    </IconButton>
                                }>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Rs. ${item.price}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="h6" mt={2}>Total: Rs. {total.toFixed(2)}</Typography>

                    <Box mt={2} display="flex" gap={2}>
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={clearCart}>
                            Clear Cart
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default CartPage;
