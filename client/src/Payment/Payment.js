import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css'; 

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, orderDate, product, orderData } = location.state;

    // State variables for form inputs
    const [name, setName] = useState('');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [cvv, setCVV] = useState('');

    const handlePayment = async () => {
        try {
            // Prepare data to send to the backend
            const paymentData = {
                orderId: orderId,
                amount: product.price,
                pdate: new Date().toISOString(),
            };

            // Replace with actual API endpoint URL
            const apiUrl = 'http://localhost:8081/api/payment';
            const response = await axios.post(apiUrl, paymentData);

            // Handle success response
            console.log(response.data); // Log success response if needed

            // Navigate to payment success page
            navigate('/payment/success', {
                state: {
                    orderId: orderId,
                    orderDate: orderDate,
                    product: product
                }
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            alert("Payment failed. Please try again."); // Alert for failure
        }
    };

    return (
        <div className="payment-container">
            <h2 className="payment-header">Payment Details</h2>
            <div className="payment-details">
                <p>Order ID: {orderId}</p>
                <p>Order Date: {orderDate}</p>
                <p>Product Name: {product.name}</p>
                <p>Product Price: {product.price}</p>
                <p>Quantity: {orderData.items[0].quantity}</p>
                <p>Total Amount: {orderData.items[0].uprice}</p>
            </div>

            <form className="payment-form">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />

                <label htmlFor="creditCardNumber">Credit Card Number:</label>
                <input
                    type="text"
                    id="creditCardNumber"
                    value={creditCardNumber}
                    onChange={(e) => setCreditCardNumber(e.target.value)}
                    required
                />
                <br />

                <label htmlFor="cvv">CVV Number:</label>
                <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCVV(e.target.value)}
                    required
                />
                <br />

                <label htmlFor="orderId">Order ID:</label>
                <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    readOnly
                />
                <br />

                <label htmlFor="amount">Amount:</label>
                <input
                    type="text"
                    id="amount"
                    value={product.price}
                    readOnly
                />
                <br />

                <button type="button" className="payment-button" onClick={handlePayment}>Pay Now</button>
            </form>
        </div>
    );
};

export default PaymentPage;
