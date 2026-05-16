import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>❤️</div>
        <h2>Your Wishlist is Empty</h2>
        <p style={styles.emptyDesc}>Save items you love and come back to buy them later.</p>
        <Link to="/" style={styles.shopBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Wishlist ({wishlistItems.length})</h2>
      <div style={styles.grid}>
        {wishlistItems.map((item) => (
          <div key={item.id} style={styles.card}>
            <Link to={`/product/${item.id}`} style={styles.imageLink}>
              <img src={item.image} alt={item.name} style={styles.image} />
            </Link>
            <div style={styles.info}>
              <p style={styles.name}>{item.name}</p>
              <p style={styles.price}>₹{(item.price * 83).toFixed(0)}</p>
            </div>
            <div style={styles.actions}>
              <button
                onClick={() => { addToCart(item); removeFromWishlist(item.id); }}
                style={styles.addBtn}
              >
                Move to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.id)}
                style={styles.removeBtn}
              >
                ✕ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1000px", margin: "0 auto" },
  heading: { fontSize: "22px", fontWeight: "700", marginBottom: "20px", textAlign: "left" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  card: { backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" },
  imageLink: { display: "block", padding: "16px", backgroundColor: "#f9f9f9", textAlign: "center" },
  image: { width: "120px", height: "120px", objectFit: "contain" },
  info: { padding: "12px 14px", flex: 1 },
  name: { margin: "0 0 6px", fontSize: "13px", fontWeight: "500", color: "#222", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  price: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#111" },
  actions: { padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: "6px" },
  addBtn: { padding: "8px", backgroundColor: "#0f0f0f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  removeBtn: { padding: "7px", backgroundColor: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", marginBottom: "16px" },
  emptyDesc: { color: "#888", marginBottom: "24px" },
  shopBtn: { display: "inline-block", padding: "12px 24px", backgroundColor: "#0f0f0f", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600" },
};

export default Wishlist;