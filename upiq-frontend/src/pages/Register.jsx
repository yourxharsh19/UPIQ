import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", form);
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>UPIQ Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <p style={styles.footer}>
          Already have an account? <span onClick={() => navigate("/login")} style={styles.link}>Login</span>
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
    backgroundColor: "#28a745", // Green for register
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

export default Register;
