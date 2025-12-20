import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Login: Calling auth.login...");
      const success = await login(form.email, form.password);
      console.log("Login: auth.login result:", success);
      if (success) {
        console.log("Login: Success! Attempting navigation to /dashboard");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login: Caught error", err);
      setError(err.response?.data?.message || "Invalid Credentials or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>UPIQ Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="email"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <p style={styles.footer}>
          Don't have an account? <span onClick={() => navigate("/register")} style={styles.link}>Register</span>
        </p>
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
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  footer: {
    marginTop: "1.5rem",
    fontSize: "0.9rem",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "bold",
  }
};

export default Login;
