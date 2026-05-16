import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.sub}>Login to continue shopping</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.registerLink}>
          New to MyShop? <Link to="/register" style={{ color: "#6c47ff", fontWeight: "600" }}>Create an account</Link>
        </p>

        <p style={styles.demo}>
          <strong>Demo:</strong> Use any email + any password to login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "20px", backgroundColor: "#f6f6f9" },
  card: { backgroundColor: "#fff", padding: "36px", borderRadius: "14px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  title: { margin: "0 0 4px", fontSize: "24px", fontWeight: "700", color: "#111" },
  sub: { margin: "0 0 24px", color: "#888", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#444", marginTop: "8px" },
  input: { padding: "10px 12px", fontSize: "14px", border: "1px solid #ddd", borderRadius: "7px", outline: "none", color: "#111" },
  error: { color: "#e53e3e", fontSize: "13px", margin: "4px 0 0" },
  button: { marginTop: "16px", padding: "12px", backgroundColor: "#0f0f0f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  registerLink: { marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" },
  demo: { marginTop: "12px", textAlign: "center", fontSize: "12px", color: "#aaa", backgroundColor: "#f9f9f9", padding: "8px", borderRadius: "6px" },
};

export default Login;