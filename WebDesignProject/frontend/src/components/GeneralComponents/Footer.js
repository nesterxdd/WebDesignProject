import React from 'react';
import './Footer.css';

const Footer = ({ onLearnMoreClick }) => {
    return (
        <footer className="footer">
            <p>© 2024 MyProject. All rights reserved.</p>
            <p>
                <a href="/contact">Contact Us</a> | <a href="/terms">Terms</a>
            </p>
            <button className="btn" onClick={onLearnMoreClick}>
                Learn More
            </button>
        </footer>
    );
};

export default Footer;
