import React, { useState } from 'react';
import './Modal.css'; // Import the modal CSS
import { loginUser } from '../../utils/authService'; // Import the auth service

const LoginModal = ({ onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Regular expression for basic email validation
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        // Validate email format before submitting
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            // Call the loginUser utility function to authenticate
            const token = await loginUser(email, password);

            // Save the token in localStorage
            localStorage.setItem('jwtToken', token);

            // Notify parent of successful login (if necessary)
            onLoginSuccess(token);

            // Close the modal
            onClose();

            // Redirect user to profile or dashboard
        } catch (err) {
            setError(err.message);
        }
    };


    const handleClickOutside = (e) => {
        // Close the modal if the click is outside the modal content
        if (e.target.classList.contains("modal")) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleClickOutside}> {/* Close on outside click */}
            <div className="modal-content"> {/* modal-content class */}
                <h2>Login</h2>
                {error && <p className="error">{error}</p>} {/* error class */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    autoComplete="email" // Autocomplete suggestion for email
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    autoComplete="current-password" // Autocomplete suggestion for password
                />
                <button onClick={handleLogin} className="btn login-btn">Login</button> {/* New button class */}
            </div>
        </div>
    );
};

export default LoginModal;
