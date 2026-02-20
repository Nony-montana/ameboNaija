import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5009/api/v1",
});

// This automatically attaches the token to every request
// so you don't have to manually add it every time
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;