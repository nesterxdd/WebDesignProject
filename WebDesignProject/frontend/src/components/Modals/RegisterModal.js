import React, { useState } from 'react';
import './Modal.css';

const RegisterModal = ({ onClose, onRegisterSuccess }) => {
    const [name, setName] = useState(''); // Add state for Name
    const [email, setEmail] = useState('');
    const [passwordHash, setPassword] = useState('');
    const [role, setRole] = useState('Student'); // Default role
    const [error, setError] = useState(null);

    // Regular expression for basic email validation
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleRegister = async () => {
        // Validate email format before submitting
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5054/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, passwordHash, role }), // Sending name, email, password, and role
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            onRegisterSuccess(data.message); // Notify parent of success
            onClose(); // Close modal
        } catch (err) {
            console.error("Registration Error:", err); // Log detailed error for debugging
            setError(err.message); // Show error in the UI
        }
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === 'modal') {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    autoComplete="name" // Autocomplete suggestion for name
                />
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
                    value={passwordHash}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    autoComplete="new-password"
                />
                <div className="input-group">
                    <label htmlFor="role-select">Select Role:</label>
                    <select
                        id="role-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="input-field"
                    >
                        <option value="Student">Student</option>
                       
                    </select>
                </div>
                <button onClick={handleRegister} className="btn login-btn">
                    Register
                </button>
            </div>
        </div>
    );
};

export default RegisterModal;
