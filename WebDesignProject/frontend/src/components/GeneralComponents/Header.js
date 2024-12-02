import React from 'react';
import './Header.css';

const Header = ({ isLoggedIn, onLoginClick, onLogout }) => {
    return (
        <header className="header">
            <h1 className="logo">MyProject</h1>
            <nav className="nav">
                <ul>
                    {!isLoggedIn ? (
                        <>
                            <li>
                                <button onClick={onLoginClick}>Login</button>
                            </li>
                            <li>
                                <button>Register</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button onClick={onLogout}>Logout</button>
                            </li>
                            <li>
                                <button>Profile</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
