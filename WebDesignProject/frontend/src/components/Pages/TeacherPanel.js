import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import './Panel.css';

const TeacherPanel = () => {
    const { userToken, handleLogin, handleLogout } = React.useContext(AuthContext);
    const isLoggedIn = !!userToken;

    const navigate = useNavigate();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    return (
        <div className="teacher-panel">
            <Header
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                onLogout={handleLogout}
            />
            <main className="content">
                <h1 className="panel-title">Teacher Panel</h1>
                <div className="teacher-actions">
                    <button className="panel-btn" onClick={() => navigate('/manage-categories')}>
                        Manage Categories
                    </button>
                    <button className="panel-btn" onClick={() => navigate('/create-resource')}>
                        Create Resource
                    </button>
                </div>
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

export default TeacherPanel;
