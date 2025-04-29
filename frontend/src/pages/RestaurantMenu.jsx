import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Box } from "@mui/material";
import api from "../services/axios"; // your Axios instance

const RestaurantMenu = () => {
    const { id } = useParams(); // Get restaurant ID from URL
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                // Fetch restaurant details
                const restaurantResponse = await api.get(`/restaurant/${id}`);
                setRestaurant(restaurantResponse.data);

                // Fetch menu items
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
                                <ListItem key={item._id}>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`$${item.price} - ${item.description}`}
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
