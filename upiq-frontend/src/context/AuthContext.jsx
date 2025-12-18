import { createContext, useState, useEffect } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Optional: Verify token with backend if endpoint exists,
                    // or decode token if using jwt-decode.
                    // For now, we assume if token exists, user is logged in.
                    // We can decode the token here to get username if needed.
                    // const decoded = jwtDecode(token);
                    // setUser({ username: decoded.sub });
                    setUser({ token });
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            // Adjust endpoint based on backend definition in UserAuthService
            const response = await api.post("/auth/login", { username, password });
            const { token } = response.data;

            localStorage.setItem("token", token);
            setUser({ token });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
