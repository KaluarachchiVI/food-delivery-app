// src/utils/axios.js
import axios from "axios";

// Create axios instance with baseURL and Authorization header
const api = axios.create({
    baseURL: "http://localhost:5000/api", // Replace with your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor to include the token in every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Ensure you have the correct key for token in localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token as Bearer
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
