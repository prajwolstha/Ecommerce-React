// ─── OrderSuccess.jsx ───────────────────────────────────────────────────────
import React from "react";
import { Link, useLocation } from "react-router-dom";

export function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId || "ORD-000";

  return (
    <div style={successStyles.container}>
      <div style={successStyles.card}>
        <div style={successStyles.icon}>✅</div>
        <h2 style={successStyles.title}>Order Placed Successfully!</h2>
        <p style={successStyles.orderId}>Order ID: <strong>{orderId}</strong></p>
        <p style={successStyles.desc}>
          Your order has been received and is being processed. You'll receive a confirmation soon.
        </p>
        <div style={successStyles.btnRow}>
          <Link to="/orders" style={successStyles.btn}>View My Orders</Link>
          <Link to="/" style={successStyles.outlineBtn}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const successStyles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", padding: "20px" },
  card: { backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "16px", padding: "48px 40px", textAlign: "center", maxWidth: "460px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  icon: { fontSize: "64px", marginBottom: "16px" },
  title: { margin: "0 0 8px", fontSize: "24px", fontWeight: "700" },
  orderId: { color: "#6c47ff", fontSize: "15px", margin: "0 0 16px" },
  desc: { color: "#666", fontSize: "14px", lineHeight: "1.6", margin: "0 0 28px" },
  btnRow: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" },
  btn: { padding: "11px 22px", backgroundColor: "#0f0f0f", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px" },
  outlineBtn: { padding: "11px 22px", backgroundColor: "transparent", color: "#0f0f0f", textDecoration: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px", border: "1.5px solid #0f0f0f" },
};

export default OrderSuccess;