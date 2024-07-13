import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../SignupValidation';
import axios from 'axios';
import './Signup.css'; // Import the CSS file

const Signup = () => {
    const [values, SetValues] = useState({
        name: "", 
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [errors, SetErrors] = useState([]);

    const handleInput = (event) =>{
        SetValues(prev => ({...prev, [event.target.name]: [event.target.value] }));
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        SetErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/signup', values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-form">
                <form onSubmit={handleSubmit}>
                    <h1>Signup</h1>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input type='text' onChange={handleInput} placeholder='Enter Name' name='name' />
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input type='email' onChange={handleInput} placeholder='Enter Email' name='email'/>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input type='password' onChange={handleInput} placeholder='Enter Password' name='password'/>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit'>Sign Up</button>
                    <Link to="/"><button className="create-account">Back To Signin</button></Link>
                </form>
            </div>
        </div>
    )
}

export default Signup;
