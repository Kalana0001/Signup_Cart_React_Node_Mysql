import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
    const [products, setProducts] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch products
        axios.get('http://localhost:8081/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false); // Set loading to false after fetching data
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false); // Set loading to false on error
            });

        // Fetch cart item count
        fetchCartItemCount();
    }, []);

    const fetchCartItemCount = () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            axios.get(`http://localhost:8081/cart/count/${userId}`)
                .then(res => {
                    setCartItemCount(res.data.count);
                })
                .catch(err => {
                    console.error("Error fetching cart item count:", err);
                });
        }
    };

    const addToCart = (productId) => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            axios.post('http://localhost:8081/cart/add', { usid: userId, pid: productId })
                .then(res => {
                    console.log(res.data);
                    // Update cart item count after adding to the cart
                    fetchCartItemCount();
                })
                .catch(err => {
                    console.error("Error adding to cart:", err);
                });
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Display loading state while fetching data
    }

    return (
        <div className="home-container">
            <h2 className="home-header">Products</h2>
            <Link to="/cartitems" className="home-link">Cart Items</Link>
            <p className="cart-count">Cart Item Count: {cartItemCount}</p>
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>Price: {product.price}</p>
                        <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                        <Link to={`/orders/${product.id}`}>
                            <button>Buy Now</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
