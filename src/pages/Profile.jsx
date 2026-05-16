import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { orders } = useOrders();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div style={styles.container}>
      {/* Avatar + Name */}
      <div style={styles.header}>
        <div style={styles.avatar}>{avatarInitial}</div>
        <div>
          {editing ? (
            <div style={styles.editRow}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.nameInput}
              />
              <button onClick={() => setEditing(false)} style={styles.saveBtn}>Save</button>
            </div>
          ) : (
            <h2 style={styles.name}>{name} <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️</button></h2>
          )}
          <p style={styles.email}>{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {[
          { label: "Orders", value: orders.length, icon: "📦", path: "/orders" },
          { label: "Wishlist", value: wishlistItems.length, icon: "❤️", path: "/wishlist" },
          { label: "In Cart", value: cartCount, icon: "🛒", path: "/cart" },
        ].map(({ label, value, icon, path }) => (
          <div key={label} style={styles.statCard} onClick={() => navigate(path)}>
            <div style={styles.statIcon}>{icon}</div>
            <div style={styles.statValue}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Account Information</h3>
        <div style={styles.infoRow}><span style={styles.infoKey}>Name</span><span>{name}</span></div>
        <div style={styles.infoRow}><span style={styles.infoKey}>Email</span><span>{user?.email}</span></div>
        <div style={styles.infoRow}><span style={styles.infoKey}>Member Since</span><span>{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span></div>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
    </div>
  );
}

const styles = {
  container: { padding: "32px 24px", maxWidth: "640px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px", padding: "24px", backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  avatar: { width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#6c47ff", color: "#fff", fontSize: "32px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name: { margin: "0 0 4px", fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" },
  email: { margin: 0, color: "#888", fontSize: "14px" },
  editBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: 0 },
  editRow: { display: "flex", alignItems: "center", gap: "8px" },
  nameInput: { padding: "6px 10px", fontSize: "16px", border: "1px solid #6c47ff", borderRadius: "6px", outline: "none", fontWeight: "600" },
  saveBtn: { padding: "6px 14px", backgroundColor: "#6c47ff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" },
  statCard: { backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", transition: "box-shadow 0.2s" },
  statIcon: { fontSize: "28px", marginBottom: "8px" },
  statValue: { fontSize: "24px", fontWeight: "700", color: "#111", marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#888" },
  section: { backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "20px", marginBottom: "20px" },
  sectionTitle: { margin: "0 0 16px", fontSize: "16px", fontWeight: "700" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5", fontSize: "14px", color: "#444" },
  infoKey: { fontWeight: "600", color: "#888" },
  logoutBtn: { width: "100%", padding: "13px", backgroundColor: "#fff", color: "#e53e3e", border: "2px solid #e53e3e", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
};

export default Profile;