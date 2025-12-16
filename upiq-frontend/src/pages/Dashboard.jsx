import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome to UPIQ</h1>
                <p style={styles.text}>You are successfully logged in!</p>
                <button onClick={handleLogout} style={styles.button}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
    },
    card: {
        padding: "3rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%",
    },
    title: {
        marginBottom: "1rem",
        color: "#333",
    },
    text: {
        marginBottom: "2rem",
        color: "#666",
        fontSize: "1.1rem",
    },
    button: {
        padding: "0.75rem 1.5rem",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#dc3545",
        color: "white",
        fontSize: "1rem",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default Dashboard;
