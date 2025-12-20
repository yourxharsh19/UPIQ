import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // API Gateway URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn("Axios Interceptor: Response ERROR detected", {
            status: error.response?.status,
            url: error.config?.url
        });
        if (error.response && error.response.status === 401) {
            console.error("Axios Interceptor: 401 UNAUTHORIZED detected! Triggering logout/redirect.");
            // Auto logout if 401 occurs
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
