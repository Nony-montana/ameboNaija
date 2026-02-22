import axios from "axios";

const API = axios.create({
    baseURL: "https://amebonaija.vercel.app/api/v1",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

// http://localhost:5009/api/v1