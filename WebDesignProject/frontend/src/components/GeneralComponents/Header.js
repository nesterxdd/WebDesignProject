import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn }) => {
    return (
        <header className="header">
            <div className="logo">MyProject</div>
            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/resources">Resources</Link>
                {isLoggedIn ? (
                    <button className="btn" onClick={() => alert('Logged out')}>
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="btn">
                            Login
                        </Link>
                        <Link to="/register" className="btn">
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
