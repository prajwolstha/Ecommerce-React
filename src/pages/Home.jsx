import useFetch
from "../hooks/useFetch";

import ProductCard
from "../components/ProductCard";

function Home() {

    const {
        data: products,
        loading,
        error
    } = useFetch(
        "https://fakestoreapi.com/products"
    );

    if (loading) {

        return <h1>Loading...</h1>;
    }

    if (error) {

        return <h1>{error}</h1>;
    }

    return (

        <div>

            <h1>All Products</h1>

            <div style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(4, 1fr)",
                gap: "20px"
            }}>

                {products.map((product) => (

                    <ProductCard
                        key={product.id}
                        product={product}
                    />

                ))}

            </div>

        </div>
    );
}

export default Home;