import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
    }, []);

    const loginUser = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        navigate('/');
    };

    const logoutUser = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
