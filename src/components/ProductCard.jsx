import React from "react";
import { useCart } from "../context/CartContext.jsx";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      {/* Product Image */}
      <img src={product.image} alt={product.name} style={styles.image} />

      {/* Product Info */}
      <h3 style={styles.title}>{product.name}</h3>
      <p style={styles.price}>₹ {product.price}</p>

      {/* Add to Cart Button */}
      <button
        style={styles.button}
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}

const styles = {
  card: {
    width: "200px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  title: {
    fontSize: "16px",
    margin: "10px 0 5px",
  },
  price: {
    color: "green",
    fontWeight: "bold",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default ProductCard;