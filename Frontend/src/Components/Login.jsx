import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ email: '', password: '', general: '' });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({ email: '', password: '', general: '' });

        let isValid = true;

        // Email validation
        if (!email) {
            setError((prev) => ({ ...prev, email: 'Email is required' }));
            isValid = false;
        } else if (!validateEmail(email)) {
            setError((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
            isValid = false;
        }

        // Password validation
        if (!password) {
            setError((prev) => ({ ...prev, password: 'Password is required' }));
            isValid = false;
        } else if (password.length < 6) {
            setError((prev) => ({ ...prev, password: 'Password must be at least 6 characters long' }));
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await axios.post('http://localhost:8081/api/login', {
                email,
                password,
            });

            console.log('Login Response:', response); // Log the full response

            // Check user role and pass role, ID, and email
            if (response.data.role === 'ADMIN') {
                onLogin({ role: 'Admin', email: email, id: response.data.id });
            } else if (response.data.role === 'EMPLOYEE') {
                const employeeId = response.data.id; // Extract the ID correctly
                onLogin({ role: 'Employee', email: email, id: employeeId }); // Pass email and employee ID
            }
        } catch (err) {
            console.error('Login Error:', err.response ? err.response.data : err.message);
            setError((prev) => ({ ...prev, general: 'Invalid login credentials' }));
        }
    };

    return (
        <div className="login-container">
             <div className='background-image'></div>

            <h1 className="app-title">Employee Management System</h1>
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error.email && <p className="error">{error.email}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error.password && <p className="error">{error.password}</p>}
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error.general && <p className="error">{error.general}</p>}
            </div>
        </div>
    );
};

export default Login;

