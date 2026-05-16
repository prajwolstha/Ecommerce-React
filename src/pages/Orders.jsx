import React from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext.jsx";

const statusColors = {
  Processing: { bg: "#fff7ed", color: "#ea580c" },
  Shipped: { bg: "#eff6ff", color: "#2563eb" },
  Delivered: { bg: "#f0fdf4", color: "#16a34a" },
  Cancelled: { bg: "#fef2f2", color: "#dc2626" },
};

function Orders() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📦</div>
        <h2>No Orders Yet</h2>
        <p>Looks like you haven't placed any orders. Start shopping!</p>
        <Link to="/" style={styles.shopBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      <div style={styles.list}>
        {orders.map((order) => {
          const sc = statusColors[order.status] || statusColors.Processing;
          return (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>{order.id}</p>
                  <p style={styles.orderDate}>Placed on {order.date}</p>
                </div>
                <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.color }}>
                  {order.status}
                </span>
              </div>

              <div style={styles.items}>
                {order.items.map((item) => (
                  <div key={item.id} style={styles.item}>
                    <img src={item.image} alt={item.name} style={styles.img} />
                    <div style={styles.itemInfo}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemMeta}>Qty: {item.quantity} · ₹{(item.price * 83 * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.shipping}>
                  📍 {order.shippingInfo?.address}, {order.shippingInfo?.city}
                </div>
                <div style={styles.total}>
                  Total: <strong>₹{(order.total * 83).toFixed(0)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "800px", margin: "0 auto" },
  heading: { fontSize: "22px", fontWeight: "700", marginBottom: "20px", textAlign: "left" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  orderId: { margin: 0, fontWeight: "700", fontSize: "15px", color: "#111" },
  orderDate: { margin: "2px 0 0", fontSize: "12px", color: "#888" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  items: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" },
  item: { display: "flex", alignItems: "center", gap: "12px" },
  img: { width: "50px", height: "50px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f5f5f5", padding: "4px" },
  itemInfo: { flex: 1 },
  itemName: { margin: 0, fontSize: "13px", fontWeight: "500", color: "#222" },
  itemMeta: { margin: "2px 0 0", fontSize: "12px", color: "#888" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f0f0f0", fontSize: "13px", color: "#666" },
  shipping: { fontSize: "12px", color: "#888" },
  total: { fontSize: "14px", color: "#222" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", marginBottom: "16px" },
  shopBtn: { display: "inline-block", marginTop: "16px", padding: "12px 24px", backgroundColor: "#0f0f0f", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600" },
};

export default Orders;