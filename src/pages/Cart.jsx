import React from "react";
import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    decreaseQty,
    addToCart,
    clearCart,
    totalPrice,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>Your Cart is Empty 🛒</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Your Cart</h2>

      {cartItems.map((item) => (
        <div key={item.id} style={styles.card}>
          {/* Product Info */}
          <img src={item.image} alt={item.name} style={styles.image} />

          <div style={styles.details}>
            <h3>{item.name}</h3>
            <p>Price: ₹ {item.price}</p>
            <p>Quantity: {item.quantity}</p>

            {/* Buttons */}
            <div style={styles.buttons}>
              <button onClick={() => addToCart(item)}>+</button>
              <button onClick={() => decreaseQty(item.id)}>-</button>
              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Total Section */}
      <div style={styles.total}>
        <h3>Total: ₹ {totalPrice}</h3>
        <button onClick={clearCart} style={styles.clearBtn}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  empty: {
    textAlign: "center",
    marginTop: "50px",
  },
  card: {
    display: "flex",
    gap: "15px",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    alignItems: "center",
  },
  image: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  details: {
    flex: 1,
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  total: {
    marginTop: "20px",
    textAlign: "right",
    fontSize: "18px",
  },
  clearBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Cart;