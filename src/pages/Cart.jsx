import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const { cartItems, removeFromCart, decreaseQty, addToCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2>Your Cart is Empty</h2>
        <p style={styles.emptyDesc}>Add some products to get started!</p>
        <Link to="/" style={styles.shopBtn}>Start Shopping</Link>
      </div>
    );
  }

  const deliveryFee = totalPrice > 500 ? 0 : 49;
  const tax = +(totalPrice * 0.18).toFixed(2);
  const grandTotal = +(totalPrice + deliveryFee + tax).toFixed(2);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Shopping Cart <span style={styles.itemCount}>({cartItems.length} items)</span></h2>

      <div style={styles.body}>
        {/* Cart Items */}
        <div style={styles.items}>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.name} style={styles.image} />
              </Link>
              <div style={styles.details}>
                <Link to={`/product/${item.id}`} style={styles.nameLink}>
                  <p style={styles.name}>{item.name}</p>
                </Link>
                <p style={styles.price}>₹{(item.price * 83).toFixed(0)} <span style={styles.priceUsd}>(${item.price})</span></p>

                {/* Qty Controls */}
                <div style={styles.qtyRow}>
                  <button onClick={() => decreaseQty(item.id)} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyVal}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)} style={styles.qtyBtn}>+</button>
                  <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>🗑 Remove</button>
                </div>
              </div>
              <div style={styles.itemTotal}>
                ₹{(item.price * 83 * item.quantity).toFixed(0)}
              </div>
            </div>
          ))}

          <button onClick={clearCart} style={styles.clearBtn}>Clear Cart</button>
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{(totalPrice * 83).toFixed(0)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? <span style={{ color: "#22c55e", fontWeight: "600" }}>FREE</span> : `₹${deliveryFee * 83}`}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>GST (18%)</span>
            <span>₹{(tax * 83).toFixed(0)}</span>
          </div>

          {deliveryFee === 0 && (
            <p style={styles.freeShip}>🎉 Free delivery applied!</p>
          )}
          {deliveryFee > 0 && (
            <p style={styles.freeShipTip}>Add ₹{((500 - totalPrice) * 83).toFixed(0)} more for free delivery</p>
          )}

          <div style={styles.divider} />
          <div style={{ ...styles.summaryRow, fontWeight: "700", fontSize: "17px" }}>
            <span>Total</span>
            <span>₹{(grandTotal * 83).toFixed(0)}</span>
          </div>

          <button onClick={() => navigate("/checkout")} style={styles.checkoutBtn}>
            Proceed to Checkout →
          </button>

          <Link to="/" style={styles.continueLink}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  heading: { fontSize: "22px", fontWeight: "700", marginBottom: "20px", textAlign: "left" },
  itemCount: { fontSize: "16px", fontWeight: "400", color: "#888" },
  body: { display: "flex", gap: "24px", alignItems: "flex-start" },
  items: { flex: 2, display: "flex", flexDirection: "column", gap: "12px" },
  card: { display: "flex", gap: "16px", padding: "16px", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", alignItems: "center" },
  image: { width: "88px", height: "88px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f5f5f5", padding: "6px", flexShrink: 0 },
  details: { flex: 1 },
  nameLink: { textDecoration: "none" },
  name: { margin: "0 0 4px", fontSize: "14px", fontWeight: "500", color: "#111", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  price: { margin: "0 0 10px", fontSize: "15px", fontWeight: "700", color: "#1a1a1a" },
  priceUsd: { fontSize: "12px", color: "#aaa", fontWeight: "400" },
  qtyRow: { display: "flex", alignItems: "center", gap: "8px" },
  qtyBtn: { width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd", backgroundColor: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "16px" },
  qtyVal: { minWidth: "28px", textAlign: "center", fontWeight: "600" },
  removeBtn: { padding: "4px 10px", backgroundColor: "transparent", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "6px", cursor: "pointer", fontSize: "12px", marginLeft: "8px" },
  itemTotal: { fontSize: "16px", fontWeight: "700", color: "#111", whiteSpace: "nowrap" },
  clearBtn: { alignSelf: "flex-start", padding: "8px 16px", backgroundColor: "transparent", color: "#888", border: "1px solid #ddd", borderRadius: "7px", cursor: "pointer", fontSize: "13px" },
  summary: { flex: 1, backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "22px", position: "sticky", top: "80px", display: "flex", flexDirection: "column", gap: "12px" },
  summaryTitle: { margin: 0, fontSize: "17px", fontWeight: "700" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#444" },
  freeShip: { textAlign: "center", fontSize: "13px", color: "#22c55e", fontWeight: "600", margin: 0, backgroundColor: "#f0fdf4", padding: "6px", borderRadius: "6px" },
  freeShipTip: { textAlign: "center", fontSize: "12px", color: "#888", margin: 0 },
  divider: { borderTop: "1px solid #eee" },
  checkoutBtn: { padding: "14px", backgroundColor: "#0f0f0f", color: "#fff", border: "none", borderRadius: "9px", cursor: "pointer", fontWeight: "700", fontSize: "15px", width: "100%" },
  continueLink: { textAlign: "center", fontSize: "13px", color: "#6c47ff", textDecoration: "none" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", marginBottom: "12px" },
  emptyDesc: { color: "#888", marginBottom: "20px" },
  shopBtn: { display: "inline-block", padding: "12px 24px", backgroundColor: "#0f0f0f", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600" },
};

export default Cart;