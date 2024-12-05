import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onLoginClick, onRegisterClick, onLogout, userData }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen((prevState) => !prevState);
    };

    const handleManageProfile = () => {
        navigate('/profile');
    };

    const handleLogoClick = () => {
        navigate('/'); // Redirect to home page
    };

    return (
        <header className="header">
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                MyProject
            </div>
            <div className="nav">
                {isLoggedIn ? (
                    <>
                        <button onClick={toggleProfileMenu} className="btn profile-btn">
                            {userData ? `${userData.name}'s Profile` : 'User Profile'}
                        </button>
                        {isProfileMenuOpen && (
                            <div className="profile-menu">
                                <button className="profile-btn" onClick={onLogout}>
                                    Logout
                                </button>
                                <button className="profile-btn" onClick={handleManageProfile}>
                                    Manage Profile
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button onClick={onLoginClick} className="btn login-btn">
                            Login
                        </button>
                        <button onClick={onRegisterClick} className="btn register-btn">
                            Register
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
