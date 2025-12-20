import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
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
            localStorage.removeItem("token");
            // Only redirect if not already on login/register
            if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
                window.location.href = "/login";
            }
        }

        // Extract meaningful error message
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        error.userFriendlyMessage = errorMessage;

        return Promise.reject(error);
    }
);

export default api;
