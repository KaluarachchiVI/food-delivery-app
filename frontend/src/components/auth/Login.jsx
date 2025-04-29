import { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import GoogleLoginButton from "./GoogleLoginButton";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";




export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // Get the user's location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        type: "Point",
                        coordinates: [position.coords.longitude, position.coords.latitude],
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocation(null);  // If location is not available
                }
            );
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("User Data:", { email, password, location });
        try {
            const response = await loginUser({ email, password, location });
            console.log("Full response:", response);  // Log the full response

            // The backend returns the data directly, not in a 'data' property
            const { token, user } = response;

            if (!token || !user) {
                throw new Error("Invalid response from server");
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role);
            console.log("User Role:", user.role);

            // Remove the hardcoded role and use the actual user role
            if (user.role === "customer") {
                navigate("/customer-dashboard");
            } else if (user.role === "restaurant") {
                navigate("/restaurant-dashboard");
            } else if (user.role === "delivery") {
                navigate("/delivery-dashboard");
            } else {
                alert("Unknown user role.");
            }

            alert("Login successful!");
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || error.message || "Login failed");
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
            <Paper elevation={4} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<LoginIcon />}
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>

                <Typography textAlign="center" variant="body2" color="text.secondary" mt={2}>
                    or
                </Typography>

                {/* Custom Google Login button */}
                <Box mt={2}>
                    <GoogleLoginButton location={location} />
                </Box>
            </Paper>
        </Box>
    );
}
