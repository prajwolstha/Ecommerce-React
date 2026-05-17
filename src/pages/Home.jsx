import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useFetch from "../hooks/useFetch.jsx";
import Loader from "../components/Loader.jsx";

const CATEGORIES = ["all", "men's clothing", "women's clothing", "electronics", "jewelery"];

function Home() {
  const { data, loading, error } = useFetch("https://fakestoreapi.com/products");
  const [activeCategory, setActiveCategory] = useState("all");

  const normalize = (p) => ({
    id: p.id,
    name: p.title,
    price: p.price,
    image: p.image,
    category: p.category,
  });

  const filtered = (data || [])
    .map(normalize)
    .filter((p) => activeCategory === "all" || p.category === activeCategory);

  return (
    <div style={styles.page}>
      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
          <p style={styles.heroSub}>Shop the latest trends across electronics, fashion, jewellery & more</p>
          <Link to="/search" style={styles.heroBtn}>Browse All →</Link>
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.categoryBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...styles.catBtn,
              backgroundColor: activeCategory === cat ? "#0f0f0f" : "#f0f0f0",
              color: activeCategory === cat ? "#fff" : "#333",
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && <Loader />}
      {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

      <div style={styles.grid}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "0 0 32px" },
  hero: {
    background: "linear-gradient(135deg, #0f0f0f 0%, #2d1b69 100%)",
    padding: "56px 32px",
    textAlign: "center",
    marginBottom: "0",
  },
  heroContent: {},
  heroTitle: { margin: "0 0 12px", fontSize: "40px", fontWeight: "800", color: "#fff", lineHeight: 1.2 },
  heroSub: { margin: "0 0 24px", color: "#ccc", fontSize: "16px" },
  heroBtn: {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: "#6c47ff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
  },
  categoryBar: { display: "flex", gap: "10px", flexWrap: "wrap", padding: "20px 24px", backgroundColor: "#fff", borderBottom: "1px solid #eee" },
  catBtn: { padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", transition: "all 0.2s" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    padding: "24px",
  },
};

export default Home;