import { createSlice } from "@reduxjs/toolkit";

// Check if user is already logged in from a previous session
const userFromStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const tokenFromStorage = localStorage.getItem("token") || null;

const initialState = {
    user: userFromStorage,
    token: tokenFromStorage,
    isLoggedIn: !!tokenFromStorage,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Called when user logs in or registers
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            // Save to localStorage so user stays logged in after refresh
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        // Called when user logs out
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;