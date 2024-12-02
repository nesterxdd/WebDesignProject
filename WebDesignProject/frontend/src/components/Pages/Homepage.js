import React, { useState } from 'react';
import Header from '../GeneralComponents/Header'; // Import Header
import Footer from '../GeneralComponents/Footer'; // Import Footer
import LoginModal from '../Modals/LoginModal'; // Import LoginModal (not just Modal)
import './Homepage.css';

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [userToken, setUserToken] = useState(null); // Store the user token here after successful login
    const isLoggedIn = !!userToken; // Check if a token is present to determine if user is logged in

    const toggleModal = () => setShowModal(!showModal); // Toggle modal visibility

    // Handle login success
    const handleLoginSuccess = (token) => {
        setUserToken(token); // Store token when login is successful
        setShowModal(false);  // Close the modal after login
    };

    // Handle logout (clear token and update state)
    const handleLogout = () => {
        setUserToken(null);  // Clear the token
    };

    return (
        <div className="homepage">
            <Header
                isLoggedIn={isLoggedIn}
                onLoginClick={toggleModal} // Pass toggleModal to open login modal
                onLogout={handleLogout} // Pass handleLogout to logout
            />
            <main className="content">
                <section className="intro">
                    <h1 className="highlight">Welcome to MyProject</h1>
                    <p className="tagline">
                        This project is created for educational purposes, combining learning and practice.
                    </p>
                    <button
                        className="resource-btn"
                        onClick={() => window.location.href = '/resources'}
                    >
                        <img src="open-book.svg" alt="Resource" />
                        Explore Resources
                    </button>
                </section>
            </main>
            <Footer/>
            {showModal && (
                <LoginModal
                    onClose={toggleModal} // Pass the function to close the modal
                    onLoginSuccess={handleLoginSuccess} // Pass handleLoginSuccess to be called after successful login
                />
            )}
        </div>
    );
};

export default HomePage;
