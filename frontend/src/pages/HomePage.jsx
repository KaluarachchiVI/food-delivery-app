// Cutsmors view
import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import api from "../services/axios"; // Make sure you're using your axios instance
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState("");

    const fetchRestaurants = async () => {
        try {
            const response = await api.get("/restaurant"); // Fetch all restaurants
            setRestaurants(response.data);
        } catch (err) {
            setError("Failed to fetch restaurants");
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom mt={4}>Restaurants</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Grid container spacing={3}>
                {restaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">{restaurant.name}</Typography>
                                <Typography>Status: {restaurant.isOpen ? "Open" : "Closed"}</Typography>
                                {/* Optional: Add View Menu Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate(`/restaurant/${restaurant._id}/menu`)}
                                >
                                    View Menu
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;
