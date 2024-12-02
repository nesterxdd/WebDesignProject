import React, { useState } from 'react';
import { fetchProtectedData } from '../../utils/api'; // Import the utility function
import './Modal.css'; // Ensure styling

const LoginModal = ({ onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [protectedData, setProtectedData] = useState(null); // State to store fetched data

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5054/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();
            const token = data.Token;

            // Save token to localStorage (or cookies, if preferred)
            localStorage.setItem('jwtToken', token);

            // Fetch protected data after login
            const fetchedData = await fetchProtectedData();
            setProtectedData(fetchedData); // Store fetched data in state

            // Notify parent of successful login
            onLoginSuccess();

            // Close modal
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                {protectedData && <p className="success">Welcome! Data fetched successfully.</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default LoginModal;
