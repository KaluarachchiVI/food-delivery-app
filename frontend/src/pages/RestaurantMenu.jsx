import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Button, Box } from "@mui/material";
import api from "../services/axios";
import { useCart } from "../contexts/CartContext";

const RestaurantMenu = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState("");

    const { addToCart, cartItems } = useCart();

    useEffect(() => {
        console.log("Cart:", cartItems);
    }, [cartItems]);

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                const restaurantResponse = await api.get(`/restaurant/${id}`);
                setRestaurant(restaurantResponse.data);

                const menuResponse = await api.get(`/restaurant/menu/${id}`);
                setMenuItems(menuResponse.data);
            } catch (err) {
                setError("Failed to load restaurant menu");
            }
        };

        fetchRestaurantAndMenu();
    }, [id]);

    if (error) {
        return (
            <Container>
                <Typography variant="h5" color="error">{error}</Typography>
            </Container>
        );
    }

    if (!restaurant) {
        return (
            <Container>
                <Typography variant="h5">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>{restaurant.name}'s Menu</Typography>

                <Card>
                    <CardContent>
                        <List>
                            {menuItems.map(item => (
                                <ListItem
                                    key={item._id}
                                    secondaryAction={
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => addToCart(item)}
                                        >
                                            Add to Cart
                                        </Button>
                                    }
                                >
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`Rs. ${item.price} — ${item.description}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default RestaurantMenu;
