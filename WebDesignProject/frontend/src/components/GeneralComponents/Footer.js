import React, { useEffect, useState } from 'react';
import './Footer.css';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Ensure the footer is visible if the page content is less than the viewport height
            const isPageShort = document.documentElement.scrollHeight <= window.innerHeight;

            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

            setIsVisible(scrolledToBottom || isPageShort); // Show if at bottom or if page is short
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger once on component mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className={`footer ${isVisible ? 'visible' : 'hidden'}`}>
            <p>&copy; 2024 MyProject. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
