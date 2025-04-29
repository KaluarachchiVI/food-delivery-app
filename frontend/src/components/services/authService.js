// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth'; // Update if your backend URL is different

// Login with email/password
export const loginUser = async ({ email, password, location }) => {
    console.log("Registering with:", { email, password, location });
    const response = await axios.post(`${API_URL}/login`, { email, password, location });
    console.log("Login Response:", response.data);  // Log the full response to check the structure

    const { token, user } = response.data;  // Destructure only if the response is as expected




    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('location', location);
    localStorage.setItem('role', user.role);



    return response.data;  // Returning user object
};


export const registerUser = async ({ name, email, password, role, location }) => {
    console.log("Registering with:", { name, email, password, role, location });

    const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
        location
    });
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
};


// Google login
export const loginWithGoogle = async () => {
    const googleUser = await window.gapi.auth2.getAuthInstance().signIn();
    const id_token = googleUser.getAuthResponse().id_token;

    const response = await axios.post(`${API_URL}/google`, {
        tokenId: id_token,
        role: 'customer', // default role for Google users
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};


export const getToken = () => {
    const token = localStorage.getItem('token', token); // Replace with 'sessionStorage' if needed
    return token;
};