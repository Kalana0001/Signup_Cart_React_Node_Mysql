import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Order.css'; 

const Ordre = () => {
    const [product, setProduct] = useState(null);
    const { pid } = useParams();
    const [userId, setUserId] = useState(null);
    const [orderId, setOrderId] = useState(null); // State to store order ID
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
            setUserId(userIdFromStorage);
        } else {
            console.error("User ID not found. Ensure the user is logged in.");
        }

        axios.get(`http://localhost:8081/products/${pid}`)
            .then(res => {
                setProduct(res.data);
            })
            .catch(err => {
                console.error("Error fetching product details:", err);
            });
    }, [pid]);

    const placeOrder = () => {
        if (!userId) {
            console.error("User ID is not set. Cannot place order.");
            return;
        }

        if (!product || !product.id) {
            console.error("Product ID is not available. Cannot place order.");
            return;
        }

        const orderData = {
            usid: userId,
            items: [
                {
                    pid: product.id,
                    quantity: 1,
                    uprice: product.price
                }
            ]
        };

        axios.post(`http://localhost:8081/orders/place`, orderData)
            .then(res => {
                console.log("Order placed successfully:", res.data);
                setOrderId(res.data.orderId); // Update state with the order ID
                navigate('/payment', { state: { orderId: res.data.orderId, orderData, product, orderDate: new Date().toLocaleDateString() } });
            })
            .catch(err => {
                console.error("Error placing order:", err);
            });
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-container">
            <h2 className="order-header">Order Details</h2>
            <div className="order-details">
                <p>Name: {product.name}</p>
                <p>Price: {product.price}</p>
                {orderId && <p>Order ID: {orderId}</p>} {/* Display order ID if available */}
                <button className="order-button" onClick={placeOrder}>Place Order</button>
            </div>
        </div>
    );
};

export default Ordre;
