import React, { useState, useContext } from 'react';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password });
            loginUser(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card"
            >
                <h2 className="text-center mb-4 fw-bold">Admin Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
                </form>
                <p className="mt-3 text-center">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
