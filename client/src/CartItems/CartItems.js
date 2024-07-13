import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CartItems.css'; 

const CartItems = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        axios.get(`http://localhost:8082/cart/${userId}`)
            .then(res => {
                if (res.data && res.data.items) {
                    setCartItems(res.data.items);
                    setTotalPrice(res.data.totalPrice);
                } else {
                    setCartItems([]);
                    setTotalPrice(0);
                }
            })
            .catch(err => {
                console.error("Error fetching cart items:", err);
                setCartItems([]);
                setTotalPrice(0);
            });
    }, []);

    const removeFromCart = (productId) => {
        const userId = localStorage.getItem('userId');
        axios.post('http://localhost:8082/cart/remove', { usid: userId, pid: productId })
            .then(res => {
                console.log(res.data);
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
                // Recalculate total price
                setTotalPrice(prevPrice => {
                    const removedItem = cartItems.find(item => item.id === productId);
                    return prevPrice - (removedItem.price * removedItem.quantity);
                });
            })
            .catch(err => {
                console.error("Error removing from cart:", err);
            });
    };

    return (
        <div className="cart-container">
            <h2 className="cart-header">Cart Items</h2>
            <Link to="/home" className="cart-link">Back to Home</Link>
            <ul className="cart-list">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <li key={item.id} className="cart-item">
                            <div>
                                <span className="cart-item-name">{item.name}</span> - 
                                <span className="cart-item-details"> {item.price} x {item.quantity} = {item.price * item.quantity}</span>
                            </div>
                            <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
                        </li>
                    ))
                ) : (
                    <li className="cart-item">No items in the cart</li>
                )}
            </ul>
            <h3 className="cart-total">Total Price: {totalPrice}</h3>
        </div>
    );
};

export default CartItems;
