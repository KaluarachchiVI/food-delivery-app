import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const BASE_URL = 'http://localhost:5005'; // Update with your API endpoint

const DeliveryDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedDeliveries();
    }, []);

    const fetchAssignedDeliveries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/delivery/assigned`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeliveries(response.data.deliveries);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch deliveries', error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (deliveryId, status) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/delivery/status/${deliveryId}`, {
                status,
            });
            console.log('Status updated:', response.data);
            fetchAssignedDeliveries(); // Refresh the dashboard
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5">Loading Deliveries...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Delivery Dashboard</Typography>

            <List>
                {deliveries.map((delivery) => (
                    <ListItem key={delivery._id}>
                        <Card sx={{ width: '100%', mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Order ID: {delivery.orderId}</Typography>
                                <Typography variant="subtitle1">Restaurant: {delivery.restaurantId}</Typography>
                                <Typography variant="body2" color="textSecondary">Status: {delivery.status}</Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleUpdateStatus(delivery._id, 'In Progress')}
                                >
                                    Start Delivery
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, ml: 1 }}
                                    onClick={() => handleUpdateStatus(delivery._id, 'Delivered')}
                                >
                                    Mark as Delivered
                                </Button>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default DeliveryDashboard;
