import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import './ResourcePage.css';

const ResourcesPage = () => {
    const { userToken, handleLogout } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        const fetchResources = async () => {
            if (!userToken) {
                setError('No token found. Please log in.');
                return;
            }

            try {
                const response = await axiosInstance.get('/resource', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setResources(response.data);
                setError('');
            } catch (err) {
                setError('Error fetching resources: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchResources();
    }, [userToken]);

    return (
        <>
            <Header
                isLoggedIn={!!userToken}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                onLogout={handleLogout}
            />
            <div className="resources-page">
                <main className="content">
                    <h1>All Resources</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="resources-list">
                        {resources.length > 0 ? (
                            resources.map((resource) => (
                                <div key={resource.id} className="resource-item">
                                    <h2>{resource.title}</h2>
                                    <p>{resource.description}</p>
                                    <p>
                                        Categories:{" "}
                                        {resource.categories?.map((category) => category.name).join(", ") || "None"}
                                    </p>
                                    <p>
                                        Created At:{" "}
                                        {resource.createdAt
                                            ? new Date(resource.createdAt).toLocaleDateString()
                                            : "Invalid Date"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            !error && <p>No resources found.</p>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={() => window.location.reload()}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onRegisterSuccess={(message) => alert(message)}
                />
            )}
        </>
    );
};

export default ResourcesPage;
