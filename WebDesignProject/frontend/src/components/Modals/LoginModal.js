import React, { useState } from 'react';
import './Modal.css'; // Import the modal CSS
import { loginUser } from '../../utils/authService'; // Import the auth service

const LoginModal = ({ onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            // Call the loginUser utility function to authenticate
            const token = await loginUser(email, password);

            // Notify parent of successful login
            onLoginSuccess(token);

            // Close the modal
            onClose();
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
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleLogin} className="btn login-btn">Login</button> {/* New button class */}
            </div>
        </div>
    );
};

export default LoginModal;
