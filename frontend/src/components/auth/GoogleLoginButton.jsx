import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { CircularProgress, MenuItem, Select, Typography } from '@mui/material';

const GoogleLoginButton = () => {
    const [role, setRole] = useState("customer");
    const [loading, setLoading] = useState(false);

    const handleSuccess = async (credentialResponse) => {
        const tokenId = credentialResponse.credential;

        setLoading(true); // Show spinner

        try {
            // First get user's location
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const res = await axios.post("http://localhost:5001/api/auth/google", {
                            tokenId,
                            role,
                            location: {
                                type: "Point",
                                coordinates: [longitude, latitude]
                            }
                        });

                        alert("Login successful!");
                        console.log(res.data);
                        localStorage.setItem("token", res.data.token);
                    } catch (err) {
                        console.error("Login failed", err?.response?.data || err);
                        alert("Login failed");
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Location permission is required!");
                    setLoading(false);
                }
            );
        } catch (err) {
            console.error("Unexpected error", err);
            alert("An unexpected error occurred!");
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Select your role:</Typography>

            <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                style={{ marginBottom: 20 }}
            >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="restaurant">Restaurant Admin</MenuItem>
                <MenuItem value="delivery">Delivery Personnel</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
            </Select>

            {loading ? (
                <CircularProgress />
            ) : (
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {
                        console.log('Login Failed');
                        alert('Google Sign-in failed');
                    }}
                    width="100%"
                    theme="outline"
                    size="large"
                />
            )}
        </div>
    );
};

export default GoogleLoginButton;
