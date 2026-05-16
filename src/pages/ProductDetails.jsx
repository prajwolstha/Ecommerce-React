import {
    useParams
} from "react-router-dom";

import useFetch
from "../hooks/useFetch";

function ProductDetails() {

    const { id } = useParams();

    const {
        data: product,
        loading,
        error
    } = useFetch(
        `https://fakestoreapi.com/products/${id}`
    );

    if (loading) {

        return <h1>Loading...</h1>;
    }

    if (error) {

        return <h1>{error}</h1>;
    }

    return (

        <div>

            <img
                src={product.image}
                alt={product.title}
                width="200"
            />

            <h1>
                {product.title}
            </h1>

            <p>
                {product.description}
            </p>

            <h2>
                ${product.price}
            </h2>

        </div>
    );
}

export default ProductDetails;