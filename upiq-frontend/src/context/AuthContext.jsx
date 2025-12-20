import { createContext, useState, useEffect } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            console.log("AuthContext: Performing checkAuth...");
            const token = localStorage.getItem("token");
            if (token) {
                console.log("AuthContext: Token found in localStorage");
                setUser({ token });
            } else {
                console.log("AuthContext: No token found");
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        console.log("AuthContext: Attempting login for email:", email);
        try {
            const response = await api.post("/auth/login", { email, password });
            console.log("AuthContext: API response received:", response.data);

            if (response.data && response.data.data && response.data.data.token) {
                const token = response.data.data.token;
                console.log("AuthContext: Login SUCCESS, token found");
                localStorage.setItem("token", token);
                setUser({ token });
                console.log("AuthContext: Global USER state updated");
                return true;
            } else {
                console.warn("AuthContext: Token MISSING in response", response.data);
                throw new Error("Invalid response structure from login API");
            }
        } catch (error) {
            console.error("AuthContext: Login request FAILED", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    const setUserFromToken = (token) => {
        if (token) {
            localStorage.setItem("token", token);
            setUser({ token });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setUserFromToken }}>
            {children}
        </AuthContext.Provider>
    );
};
