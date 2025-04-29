import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, TextField, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../services/axios"; // Import the custom Axios instance

const RestaurantDashboard = () => {
    const [restaurant, setRestaurant] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "", price: "" });
    const [editMenuItem, setEditMenuItem] = useState(null); // Track the menu item being edited
    const [error, setError] = useState("");
    const [newRestaurant, setNewRestaurant] = useState({ name: "", isOpen: false }); // State for new restaurant form



    // Fetch the menu items and restaurant details once the restaurant is set
    useEffect(() => {
        if (restaurant._id) {
            fetchMenu();
        }
    }, [restaurant]);

    // Fetch restaurant details on component mount (checking for restaurant ID in localStorage)
    useEffect(() => {
        const restaurantId = localStorage.getItem("restaurantId");
        if (restaurantId) {
            fetchRestaurantDetailsById(restaurantId); // pass ID directly
        }
    }, []);


    // Fetch restaurant details based on restaurant ID
    const fetchRestaurantDetailsById = async (id) => {
        try {
            const response = await api.get(`/restaurant/${id}`);
            setRestaurant(response.data);
        } catch (err) {
            setError("Failed to fetch restaurant details");
        }
    };

    // Fetch the menu items for the current restaurant
    const fetchMenu = async () => {
        try {
            const response = await api.get(`/restaurant/menu/${restaurant._id}`);
            setMenuItems(response.data);
        } catch (err) {
            setError("Failed to fetch menu items");
        }
    };

    // Handle adding a new menu item
    const handleAddMenuItem = async () => {
        try {
            const response = await api.post("/restaurant/menu", {
                restaurantId: restaurant._id,
                name: newMenuItem.name,
                description: newMenuItem.description,
                price: newMenuItem.price,
            });
            setMenuItems([...menuItems, response.data]);
            setNewMenuItem({ name: "", description: "", price: "" });
        } catch (err) {
            setError("Failed to add menu item");
        }
    };

    // Handle editing a menu item
    const handleEditMenuItem = async () => {
        try {
            const response = await api.put(`/restaurant/menu/${editMenuItem._id}`, {
                name: newMenuItem.name,
                description: newMenuItem.description,
                price: newMenuItem.price,
            });
            setMenuItems(menuItems.map((item) => (item._id === editMenuItem._id ? response.data : item)));
            setNewMenuItem({ name: "", description: "", price: "" });
            setEditMenuItem(null); // Reset the editing state
        } catch (err) {
            setError("Failed to update menu item");
        }
    };

    // Handle deleting a menu item
    const handleDeleteMenuItem = async (id) => {
        try {
            await api.delete(`/restaurant/menu/${id}`);
            setMenuItems(menuItems.filter((item) => item._id !== id)); // Remove the item from state
        } catch (err) {
            setError("Failed to delete menu item");
        }
    };

    const handleCreateRestaurant = async () => {
        try {
            const location = {
                type: "Point", // This specifies it's a geographical point
                coordinates: [-74.0060, 40.7128] // Replace with actual longitude and latitude (e.g., New York's coordinates)
            };

            const response = await api.post("/restaurant/create", {
                name: newRestaurant.name,
                isOpen: newRestaurant.isOpen,
                location: location, // Include the location field
            });

            setRestaurant(response.data);
            localStorage.setItem("restaurantId", response.data._id); // Save the restaurant ID in localStorage
            setNewRestaurant({ name: "", isOpen: false }); // Clear the form
        } catch (err) {
            setError("Failed to create restaurant");
        }
    };


    return (
        <Container>
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>Restaurant Dashboard</Typography>

                {error && <Typography color="error">{error}</Typography>}

                {/* Restaurant Creation Form */}
                {!restaurant._id && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h5">Create Restaurant</Typography>
                            <TextField
                                label="Restaurant Name"
                                fullWidth
                                value={newRestaurant.name}
                                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                            />
                            <TextField
                                label="Is Open"
                                type="checkbox"
                                fullWidth
                                checked={newRestaurant.isOpen}
                                onChange={(e) => setNewRestaurant({ ...newRestaurant, isOpen: e.target.checked })}
                                sx={{ mt: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateRestaurant}
                                sx={{ mt: 2 }}
                            >
                                Create Restaurant
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Restaurant Info */}
                {restaurant._id && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Restaurant Details</Typography>
                                    <Typography>Name: {restaurant.name}</Typography>
                                    <Typography>Status: {restaurant.isOpen ? "Open" : "Closed"}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Menu Management */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{editMenuItem ? "Edit Menu Item" : "Add Menu Item"}</Typography>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={newMenuItem.name}
                                        onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                    />
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        value={newMenuItem.description}
                                        onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        label="Price"
                                        type="number"
                                        fullWidth
                                        value={newMenuItem.price}
                                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={editMenuItem ? handleEditMenuItem : handleAddMenuItem}
                                        sx={{ mt: 2 }}
                                    >
                                        {editMenuItem ? "Update Menu Item" : "Add Menu Item"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Menu Items */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Menu Items</Typography>
                                    <List>
                                        {menuItems.map((item) => (
                                            <ListItem key={item._id}>
                                                <ListItemText primary={item.name} secondary={`$${item.price}`} />
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => {
                                                        setNewMenuItem({ name: item.name, description: item.description, price: item.price });
                                                        setEditMenuItem(item);
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton edge="end" onClick={() => handleDeleteMenuItem(item._id)}>
                                                    <Delete />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default RestaurantDashboard;
