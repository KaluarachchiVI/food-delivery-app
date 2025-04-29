import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { Box, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, CircularProgress } from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Get the user's location when the component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        type: "Point",
                        coordinates: [position.coords.longitude, position.coords.latitude],
                    });
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocation(null);
                    setLoading(false);
                }
            );
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("Password entered:", password);
        console.log("User Data:", { name, email, password, role, location });

        // Validate that password is not empty
        if (!password) {
            alert("Password is required");
            return;
        }


        try {
            const response = await registerUser({ name, email, password, role, location });  // Send location as part of register

            const { token, user } = response;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            alert("Registration successful!");

            if (response) {
                navigate("/");
            }

        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Box sx={{ p: 4, width: 400, backgroundColor: "white", borderRadius: "8px", boxShadow: 3 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="customer">Customer</MenuItem>
                            <MenuItem value="restaurant">Restaurant</MenuItem>
                            <MenuItem value="delivery">Delivery</MenuItem>
                        </Select>
                    </FormControl>

                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Register
                        </Button>
                    )}
                </form>
            </Box>
        </Box>
    );
}
