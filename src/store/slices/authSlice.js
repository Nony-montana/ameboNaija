import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Read user from cookie on initial load instead of localStorage
const userFromStorage = cookies.get("user") || null;
const tokenFromStorage = cookies.get("token") || null;

const initialState = {
    user: userFromStorage,
    token: tokenFromStorage,
    isLoggedIn: !!tokenFromStorage,
};

const authSlice = createSlice({
    name: "auth",
    reducers: {
        // Called when user logs in or registers
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            // Save to cookies with 5 hour expiry
            cookies.set("user", action.payload.user, { path: "/", maxAge: 5 * 60 * 60, sameSite: "strict" });
            cookies.set("token", action.payload.token, { path: "/", maxAge: 5 * 60 * 60, sameSite: "strict" });
        },

        // Called when user logs out
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            cookies.remove("user", { path: "/" });
            cookies.remove("token", { path: "/" });
        },

        // Called after profile update to sync new name/email across the app
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            // Keep cookie in sync with updated user data
            cookies.set("user", state.user, { path: "/", maxAge: 5 * 60 * 60, sameSite: "strict" });
        },

        // Called by App.jsx on page load to restore auth state from cookie
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
    },
    initialState,
});

export const { loginSuccess, logout, updateUser, setUser } = authSlice.actions;
export default authSlice.reducer;