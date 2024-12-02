import React, { useState } from 'react';
import Header from '../GeneralComponents/Header'; // Import Header
import Footer from '../GeneralComponents/Footer'; // Import Footer
import Modal from '../Modals/Modal'; // Import Modal
import './Homepage.css';

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const isLoggedIn = false; // Replace with actual login state from context or props

    const toggleModal = () => setShowModal(!showModal);

    return (
        <div className="homepage">
            <Header isLoggedIn={isLoggedIn} onLogout={() => alert('Logged out')} />
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
            <Footer onLearnMore={toggleModal} />
            {showModal && (
                <Modal onClose={toggleModal}>
                    <h2>About This Project</h2>
                    <p>
                        MyProject is a platform built for educational purposes to demonstrate modern web
                        development practices using React and more.
                    </p>
                </Modal>
            )}
        </div>
    );
};

export default HomePage;