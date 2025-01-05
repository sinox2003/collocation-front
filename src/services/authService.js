// src/services/authService.js
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "a86baa5fc1b924757aa2b1608979c201-868973959.us-east-1.elb.amazonaws.com/auth";

// Helper function to set JWT and user details in cookies
const setAuthData = (token, user) => {
    Cookies.set("jwtToken", token, { expires: 7 }); // JWT token
    Cookies.set("userId", user.id, { expires: 7 }); // User ID
    Cookies.set("userName", user.name, { expires: 7 }); // User name
    Cookies.set("userEmail", user.email, { expires: 7 }); // User email

};


// Login with email/password
export const loginWithUsernamePassword = async (email, password) => {
    const response = await axios.post(`${API_URL}/token-by-email`, {email, password});
    const {accessToken, user ,profilePicture} = response.data; // Assuming backend returns both token and user details
    setAuthData(accessToken, user);
    return {token: accessToken, user ,profilePicture}; // Return token and user for further use
};

// Login with Google
export const loginWithGoogle = async (googleToken) => {
    const deviceToken = Cookies.get("fcmToken"); 
    const response = await axios.post(`${API_URL}/google`, {token: googleToken ,device_token: deviceToken,});
    const { accessToken, user, isNewUser , profilePicture} = response.data; // Assuming backend returns both token and user details
    setAuthData(accessToken, user);
    return {token: accessToken, user , isNewUser,profilePicture}; // Return token and user for further use
};

// Login with Facebook
export const loginWithFacebook = async (facebookToken) => {
    const deviceToken = Cookies.get("fcmToken");
    const response = await axios.post(`${API_URL}/facebook`, {token: facebookToken  , device_token: deviceToken,});
    const { accessToken, user, isNewUser ,profilePicture } = response.data; // Assuming backend returns both token and user details
    setAuthData(accessToken, user);
    return {token: accessToken, user , isNewUser,profilePicture}; // Return token and user for further use
};
