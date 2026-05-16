import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.desc}>Oops! The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={styles.btn}>← Go Back Home</Link>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "80px 20px" },
  code: { fontSize: "96px", fontWeight: "800", color: "#6c47ff", margin: "0 0 8px", lineHeight: 1 },
  title: { fontSize: "28px", fontWeight: "700", margin: "0 0 12px" },
  desc: { color: "#888", fontSize: "15px", margin: "0 0 28px" },
  btn: { display: "inline-block", padding: "12px 24px", backgroundColor: "#0f0f0f", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600", fontSize: "15px" },
};

export default NotFound;