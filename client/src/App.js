import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 
import Signin from './Signin/Signin';
import Signup from './Signup/Signup';
import Home from './Home/Home';
import CartItems from './CartItems/CartItems';
import Ordre from './Order/Ordre';
import Payment from './Payment/Payment';
import PaymentSuccessPage from './PaymentSuccessPage/PaymentSuccessPage';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/cartitems" element={<CartItems />} />
                <Route path="/orders/:pid" element={<Ordre />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
