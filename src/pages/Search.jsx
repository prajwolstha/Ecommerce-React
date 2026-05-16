import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useFetch from "../hooks/useFetch.jsx";
import Loader from "../components/Loader.jsx";

const CATEGORIES = ["all", "men's clothing", "women's clothing", "electronics", "jewelery"];

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data, loading, error } = useFetch("https://fakestoreapi.com/products");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const normalize = (product) => ({
    id: product.id,
    name: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    rating: product.rating?.rate,
  });

  let results = (data || []).map(normalize);

  // Filter by query
  if (query) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by category
  if (category !== "all") {
    results = results.filter((p) => p.category === category);
  }

  // Sort
  if (sortBy === "price-asc") results = [...results].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") results = [...results].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>
          {query ? `Results for "${query}"` : "All Products"}
          <span style={styles.count}>{results.length} items</span>
        </h2>
        <div style={styles.controls}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              ...styles.catBtn,
              backgroundColor: category === cat ? "#0f0f0f" : "#f0f0f0",
              color: category === cat ? "#fff" : "#333",
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && <Loader />}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && results.length === 0 && (
        <div style={styles.noResults}>
          <p style={styles.noResultsIcon}>🔍</p>
          <h3>No products found</h3>
          <p style={{ color: "#888" }}>Try different keywords or browse all categories.</p>
        </div>
      )}

      <div style={styles.grid}>
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
  heading: { margin: 0, fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" },
  count: { fontSize: "14px", color: "#888", fontWeight: "400" },
  controls: { display: "flex", gap: "10px" },
  select: { padding: "8px 12px", borderRadius: "7px", border: "1px solid #ddd", fontSize: "13px", backgroundColor: "#fff", cursor: "pointer" },
  categories: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  catBtn: { padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "500", transition: "all 0.2s" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  noResults: { textAlign: "center", padding: "60px 20px" },
  noResultsIcon: { fontSize: "48px", marginBottom: "8px" },
};

export default Search;