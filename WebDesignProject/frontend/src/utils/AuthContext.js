import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(localStorage.getItem('jwtToken') || null);

    // Sync logout or login across tabs or windows
    useEffect(() => {
        const syncAuth = (e) => {
            if (e.key === 'jwtToken') {
                setUserToken(localStorage.getItem('jwtToken'));
            }
        };

        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    const handleLogin = (token) => {
        setUserToken(token);
        localStorage.setItem('jwtToken', token);
    };

    const handleLogout = () => {
        setUserToken(null);
        localStorage.removeItem('jwtToken');
    };

    return (
        <AuthContext.Provider value={{ userToken, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
