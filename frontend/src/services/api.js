
import axios from "axios";

const API = axios.create({
  baseURL: "https://cmrs-fq4z.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the saved JWT access token to protected API requests.
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API error:",
      error.response?.status,
      error.config?.url,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default API;