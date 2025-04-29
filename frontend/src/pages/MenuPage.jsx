import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { io } from 'socket.io-client';





// Setup your backend URL here
const BASE_URL = 'http://localhost:5002';
const BASE_URI = 'http://localhost:5000';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [socket, setSocket] = useState(null);


    useEffect(() => {
        fetchMenu();
        connectSocket();
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await axios.get(`${BASE_URI}/api/restaurant/menus`);
            console.log(response.data);
            setMenuItems(response.data); // No .menu, just data
        } catch (error) {
            console.error('Failed to fetch menu', error);
            showSnackbar('Failed to load menu', 'error');
        }
    };


    const connectSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(BASE_URL, {
            auth: { token },
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('orderAssigned', (data) => {
            console.log('Order Assigned:', data);
            showSnackbar(`Driver assigned: ${data.driverName}`, 'info');
        });

        newSocket.on('deliveryStatusUpdated', (data) => {
            console.log('Delivery Status Updated:', data);
            showSnackbar(`Order status: ${data.status}`, 'info');
        });

        setSocket(newSocket);
    };

    const handleAddToCart = (item) => {
        const existingItem = cartItems.find((i) => i.id === item.id);
        if (existingItem) {
            setCartItems(
                cartItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    const handleRemoveFromCart = (itemId) => {
        setCartItems(cartItems.filter((i) => i.id !== itemId));
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            showSnackbar('Cart is empty', 'warning');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            showSnackbar('You must be logged in', 'error');
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/api/orders`,
                {
                    restaurantId: menuItems[0]?.restaurantId || 'RESTAURANT_ID_HERE', // You should adjust this depending on your backend
                    items: cartItems.map(({ id, name, quantity, price }) => ({
                        name,
                        quantity,
                        price,
                    })),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Order placed:', response.data);
            showSnackbar('Order placed successfully!', 'success');
            setCartItems([]);
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Error placing order:', error.response?.data || error.message);
            showSnackbar('Failed to place order', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{item.name}</Typography>
                                    <Typography variant="body2">${item.price}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleAddToCart(item)}>
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ m: 2 }}>
                        Loading menu...
                    </Typography>
                )}
            </Grid>

            {/* Cart Floating Button */}
            <IconButton
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'white',
                    boxShadow: 3,
                }}
                onClick={() => setIsDrawerOpen(true)}
            >
                <Badge badgeContent={cartItemCount} color="secondary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            {/* Cart Drawer */}
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <Container sx={{ width: 300, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Your Cart
                    </Typography>
                    <List>
                        {cartItems.map((item) => (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <Button
                                        color="error"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                    >
                                        Remove
                                    </Button>
                                }
                            >
                                <ListItemText
                                    primary={`${item.name} x${item.quantity}`}
                                    secondary={`$${item.price * item.quantity}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                </Container>
            </Drawer>

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

export default MenuPage;
