import React, { useEffect, useState } from 'react';
import {
    Container,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { io } from 'socket.io-client';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const BASE_URL = 'http://localhost:5002'; // Change if needed

const steps = [
    'Order Placed',
    'Preparing',
    'Driver Assigned',
    'Out for Delivery',
    'Delivered',
];

const statusToStep = {
    placed: 0,
    preparing: 1,
    driver_assigned: 2,
    out_for_delivery: 3,
    delivered: 4,
};

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const TrackOrderPage = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // ← replace this
    });

    useEffect(() => {
        fetchOrderDetails();
        connectSocket();
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrder(response.data.order);
            setActiveStep(statusToStep[response.data.order.status] || 0);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch order details', error);
            setLoading(false);
            showSnackbar('Failed to load order', 'error');
        }
    };

    const connectSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(BASE_URL, {
            auth: { token },
        });

        newSocket.on('connect', () => {
            console.log('Socket connected for tracking:', newSocket.id);
            newSocket.emit('joinOrderRoom', { orderId });
        });

        newSocket.on('deliveryStatusUpdated', (data) => {
            console.log('Order status updated:', data);
            if (data.orderId === orderId) {
                setOrder((prev) => ({ ...prev, status: data.status }));
                setActiveStep(statusToStep[data.status] || activeStep);
                showSnackbar(`Status updated: ${data.status.replace('_', ' ')}`, 'info');
            }
        });

        newSocket.on('driverLocationUpdate', (data) => {
            if (data.orderId === orderId) {
                console.log('Driver location updated:', data);
                setDriverLocation({ lat: data.latitude, lng: data.longitude });
            }
        });

        setSocket(newSocket);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading || !isLoaded) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Loading...</Typography>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6">Order not found</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Track Your Order</Typography>

            <Card sx={{ my: 4 }}>
                <CardContent>
                    <Typography variant="h6">Order ID: {order.orderId}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        Current Status: {order.status.replace('_', ' ')}
                    </Typography>
                </CardContent>
            </Card>

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {driverLocation && (
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Driver's Location</Typography>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={driverLocation}
                            zoom={15}
                        >
                            <Marker position={driverLocation} />
                        </GoogleMap>
                    </CardContent>
                </Card>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TrackOrderPage;
