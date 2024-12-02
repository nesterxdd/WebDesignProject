import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = (token) => {
        // Save token (e.g., in localStorage)
        localStorage.setItem('authToken', token);
        window.location.reload(); // Reload the app or update state
    };

    return (
        <header className="header">
            <div className="logo">MyProject</div>
            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/resources">Resources</Link>
                {isLoggedIn ? (
                    <button className="btn" onClick={onLogout}>
                        Logout
                    </button>
                ) : (
                    <>
                        <button className="btn" onClick={() => setShowLogin(true)}>
                            Login
                        </button>
                        <button className="btn" onClick={() => setShowRegister(true)}>
                            Register
                        </button>
                    </>
                )}
            </nav>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
            {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
        </header>
    );
};

export default Header;
