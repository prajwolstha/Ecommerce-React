import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  // Guard: don't render if product is missing or malformed
  if (!product || !product.id) return null;

  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const rating = ((product.price % 2) + 3.5).toFixed(1);
  const stars = Math.min(5, Math.max(1, Math.round(parseFloat(rating))));
  const priceInr = (product.price * 83).toFixed(0);

  return (
    <Link to={`/product/${product.id}`} style={styles.cardLink}>
      <div style={styles.card}>

        {/* Wishlist Button */}
        {user && (
          <button
            onClick={handleWishlist}
            style={{ ...styles.wishlistBtn, color: wishlisted ? "#ff4757" : "#bbb" }}
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? "♥" : "♡"}
          </button>
        )}

        {/* Image */}
        <div style={styles.imageWrap}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>

        {/* Info */}
        <div style={styles.info}>
          <p style={styles.title}>{product.name}</p>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
            <span style={styles.ratingNum}>{rating}</span>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.price}>NPR{priceInr}</span>
            <span style={styles.priceUsd}>${product.price}</span>
          </div>
        </div>

        {/* Add to Cart */}
        <button onClick={handleAddToCart} style={styles.addBtn}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

const styles = {
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
  },
  card: {
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "14px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    cursor: "pointer",
  },
  wishlistBtn: {
    position: "absolute",
    top: "10px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
    zIndex: 1,
  },
  imageWrap: {
    height: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "8px",
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "140px",
    objectFit: "contain",
  },
  info: {
    flex: 1,
    textAlign: "left",
  },
  title: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#222",
    margin: "0 0 4px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "1.4",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  stars: {
    color: "#f5a623",
    fontSize: "12px",
    letterSpacing: "1px",
  },
  ratingNum: {
    fontSize: "12px",
    color: "#888",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
  },
  price: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  priceUsd: {
    fontSize: "12px",
    color: "#aaa",
  },
  addBtn: {
    marginTop: "4px",
    padding: "9px",
    width: "100%",
    border: "none",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "7px",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default ProductCard;