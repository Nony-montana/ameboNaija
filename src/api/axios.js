// import axios from "axios";

// const API = axios.create({
//     baseURL: "https://theamebonaija-backend.onrender.com/api/v1",
// });

// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default API;

// http://localhost:5009/api/v1

import axios from "axios";
import Cookies from "universal-cookie";
import { logout } from "../store/slices/authSlice";
import store from '../store/store.js'

const cookies = new Cookies();

const API = axios.create({
  baseURL:
    "https://theamebo-naija-backend.vercel.app/api/v1" ||
    "http://localhost:5000/api/v1",
});

// Request interceptor — automatically attach token from cookies to every request
// This means you never have to manually pass the token anywhere in your app
API.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — if backend returns 401 (token expired/missing),
// automatically clear cookies and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookies.remove("token", { path: "/" });
      cookies.remove("user", { path: "/" });
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
