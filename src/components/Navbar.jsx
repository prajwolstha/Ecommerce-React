import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🛍️ MyShop
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn}>🔍</button>
      </form>

      {/* Nav Links */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {user && (
          <>
            <Link to="/wishlist" style={styles.link}>
              ❤️ {wishlistItems.length > 0 && <span style={styles.badge}>{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart" style={styles.link}>
              🛒 {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerLink}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
  },
  logo: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    letterSpacing: "-0.5px",
  },
  searchForm: {
    display: "flex",
    flex: 1,
    maxWidth: "400px",
    gap: "0",
  },
  searchInput: {
    flex: 1,
    padding: "8px 14px",
    fontSize: "14px",
    border: "none",
    borderRadius: "6px 0 0 6px",
    outline: "none",
    backgroundColor: "#1e1e1e",
    color: "#fff",
  },
  searchBtn: {
    padding: "8px 14px",
    backgroundColor: "#6c47ff",
    color: "#fff",
    border: "none",
    borderRadius: "0 6px 6px 0",
    cursor: "pointer",
    fontSize: "14px",
  },
  links: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    position: "relative",
    padding: "4px 2px",
  },
  badge: {
    backgroundColor: "#ff4757",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    padding: "2px 5px",
    position: "absolute",
    top: "-6px",
    right: "-8px",
    fontWeight: "bold",
  },
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "transparent",
    color: "#ff4757",
    border: "1px solid #ff4757",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  registerLink: {
    padding: "6px 14px",
    backgroundColor: "#6c47ff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default Navbar;