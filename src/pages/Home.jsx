import React from "react";
import ProductCard from "../components/ProductCard.jsx";
import useFetch from "../hooks/useFetch.jsx";
import Loader from "../components/Loader.jsx";

function Home() {
  const { data, loading, error } = useFetch(
    "https://fakestoreapi.com/products"
  );

  if (loading) return <Loader />;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={styles.container}>
      <h1>Products</h1>

      <div style={styles.grid}>
        {data.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.title,
              price: product.price,
              image: product.image,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
};

export default Home;