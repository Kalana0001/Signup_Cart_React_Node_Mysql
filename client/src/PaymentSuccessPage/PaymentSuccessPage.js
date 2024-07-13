import React from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentSuccessPage.css'; 

const PaymentSuccessPage = () => {
    const location = useLocation();

    if (!location.state) {
        // Handle case where state is not available (shouldn't happen ideally)
        return <div>Error: Payment details not found.</div>;
    }

    const { orderId, orderDate, product } = location.state;

    return (
        <div className="payment-success-container">
            <div className="payment-success-message">
                <h2>Payment Successful!</h2>
                <p>Order ID: {orderId}</p>
                <p>Order Date: {orderDate}</p>
                <p>Product: <span className="product-name">{product.name}</span></p>
                <p>Total Amount: <span className="total-amount">{product.price}</span></p>
                <p className="thank-you">Thank you for your purchase!</p>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
