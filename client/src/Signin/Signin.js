import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signin.css';

const Signin = () => {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                const { message, userId } = res.data;
                if (message === "Success") {
                    localStorage.setItem('userId', userId);
                    navigate('/home');
                } else {
                    setError("Invalid credentials");
                }
            })
            .catch(err => {
                setError("Something went wrong. Please try again later.");
                console.error("Login error:", err);
            });
    };

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={values.email} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={values.password} onChange={handleInputChange} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Sign In</button>
                </form>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Signin;
