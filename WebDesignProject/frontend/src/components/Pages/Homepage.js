import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import axiosInstance from '../../utils/axiosInstance';
import './Homepage.css';

const HomePage = () => {
    const { userToken, handleLogin, handleLogout } = useContext(AuthContext);
    const isLoggedIn = !!userToken;

    // State for user role and modals
    const [userRole, setUserRole] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!userToken) return;

            try {
                const response = await axiosInstance.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setUserRole(response.data.role);
            } catch (err) {
                console.error('Error fetching user role:', err.message);
            }
        };

        fetchUserRole();
    }, [userToken]);

    const navigateToAdminPanel = () => {
        window.location.href = '/admin-panel';
    };

    const navigateToTeacherPanel = () => {
        window.location.href = '/teacher-panel';
    };

    return (
        <div className="homepage">
            <Header
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                onLogout={handleLogout}
            />
            <main className="content">
                <section className="intro">
                    <h1 className="highlight">Welcome to MyProject</h1>
                    <button
                        className="resource-btn"
                        onClick={() => window.location.href = '/resources'}
                    >
                        Explore Resources
                    </button>
                    {isLoggedIn && userRole === 'admin' && (
                        <button
                            className="resource-btn"
                            onClick={navigateToAdminPanel}
                        >
                            Admin Panel
                        </button>
                    )}
                    {isLoggedIn && userRole === 'teacher' && (
                        <button
                            className="resource-btn"
                            onClick={navigateToTeacherPanel}
                        >
                            Teacher Panel
                        </button>
                    )}
                </section>
            </main>
            <Footer />
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLogin}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onRegisterSuccess={(message) => alert(message)}
                />
            )}
        </div>
    );
};

export default HomePage;
