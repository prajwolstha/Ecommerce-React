import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

function ProductDetails() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(`https://fakestoreapi.com/products/${id}`);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  if (loading) return <Loader />;
  if (error) return <div style={styles.error}><h2>Error loading product</h2><Link to="/">← Back to Home</Link></div>;
  if (!product) return null;

  const item = {
    id: product.id,
    name: product.title,
    price: product.price,
    image: product.image,
  };

  const wishlisted = isWishlisted(product.id);
  const rating = product.rating?.rate || 4.0;
  const count = product.rating?.count || 0;
  const filledStars = Math.round(rating);

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Products</Link>

      <div style={styles.body}>
        {/* Image */}
        <div style={styles.imageWrap}>
          <img src={product.image} alt={product.title} style={styles.image} />
        </div>

        {/* Info */}
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.title}>{product.title}</h1>

          {/* Rating */}
          <div style={styles.ratingRow}>
            <span style={styles.stars}>{"★".repeat(filledStars)}{"☆".repeat(5 - filledStars)}</span>
            <span style={styles.ratingNum}>{rating}</span>
            <span style={styles.ratingCount}>({count} reviews)</span>
          </div>

          {/* Price */}
          <div style={styles.priceBlock}>
            <span style={styles.price}>₹{(product.price * 83).toFixed(0)}</span>
            <span style={styles.priceUsd}>(${product.price})</span>
          </div>

          {/* Tags */}
          <div style={styles.tags}>
            <span style={styles.tag}>✅ In Stock</span>
            <span style={styles.tag}>🚚 Free delivery on orders over ₹41,500</span>
            <span style={styles.tag}>↩️ 30-day returns</span>
          </div>

          {/* Description */}
          <p style={styles.desc}>{product.description}</p>

          {/* Actions */}
          <div style={styles.actions}>
            <button onClick={() => addToCart(item)} style={styles.addBtn}>
              🛒 Add to Cart
            </button>
            {user && (
              <button
                onClick={() => toggleWishlist(item)}
                style={{
                  ...styles.wishBtn,
                  borderColor: wishlisted ? "#ff4757" : "#ddd",
                  color: wishlisted ? "#ff4757" : "#555",
                }}
              >
                {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1000px", margin: "0 auto" },
  backLink: { textDecoration: "none", color: "#6c47ff", fontSize: "14px", fontWeight: "600", display: "inline-block", marginBottom: "20px" },
  body: { display: "flex", gap: "40px", alignItems: "flex-start" },
  imageWrap: { flex: 1, backgroundColor: "#f9f9f9", borderRadius: "16px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "360px" },
  image: { maxWidth: "100%", maxHeight: "320px", objectFit: "contain" },
  info: { flex: 1.2, textAlign: "left" },
  category: { display: "inline-block", backgroundColor: "#f0f0f0", color: "#666", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" },
  title: { margin: "0 0 12px", fontSize: "22px", fontWeight: "700", lineHeight: "1.3", color: "#111" },
  ratingRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
  stars: { color: "#f5a623", fontSize: "18px", letterSpacing: "2px" },
  ratingNum: { fontWeight: "700", fontSize: "15px", color: "#333" },
  ratingCount: { fontSize: "13px", color: "#888" },
  priceBlock: { display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" },
  price: { fontSize: "28px", fontWeight: "800", color: "#111" },
  priceUsd: { fontSize: "14px", color: "#aaa" },
  tags: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" },
  tag: { fontSize: "13px", color: "#555" },
  desc: { fontSize: "14px", lineHeight: "1.7", color: "#555", marginBottom: "24px" },
  actions: { display: "flex", gap: "12px" },
  addBtn: { flex: 1, padding: "14px", backgroundColor: "#0f0f0f", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  wishBtn: { padding: "14px 20px", backgroundColor: "#fff", border: "2px solid #ddd", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s" },
  error: { textAlign: "center", padding: "60px" },
};

export default ProductDetails;