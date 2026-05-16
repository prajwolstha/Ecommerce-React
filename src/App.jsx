import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";

// Layout
import MainLayout from "./layouts/MainLayout.jsx";

// Route protection
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* All pages wrapped inside MainLayout */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="login" element={<Login />} />

        {/* Protected Route Example */}
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;