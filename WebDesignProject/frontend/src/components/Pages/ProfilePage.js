import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import './ProfilePage.css';

const ProfilePage = () => {
    const { userToken, handleLogin, handleLogout } = useContext(AuthContext);
    const isLoggedIn = !!userToken;
    const navigate = useNavigate(); // Initialize navigate for redirection

    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        createdAt: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);

    // Fetch user data when the component mounts or when the token changes
    useEffect(() => {
        if (userToken) {
            const fetchUserData = async () => {
                try {
                    const response = await axiosInstance.get('/users/me', {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    });
                    setUser(response.data);
                } catch (err) {
                    setError('Error fetching user data: ' + (err.response?.data?.message || err.message));
                    console.error(err);
                }
            };
            fetchUserData();
        }
    }, [userToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleUpdateUser = async () => {
        const updateData = {
            name: user.name,
            email: user.email,
        };

        try {
            const response = await axiosInstance.put(`/users/${user.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setUser(response.data);
            setSuccess('Profile updated successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
            setSuccess('');
            console.error(err);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setSuccess('');
            return;
        }

        try {
            await axiosInstance.put(`/users/update-password/${user.id}`, passwordData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setSuccess('Password updated successfully');
            setError('');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating password');
            setSuccess('');
            console.error(err);
        }
    };

    const handleNavigateToReviews = () => {
        navigate('/my-reviews'); // Redirect to the reviews management page
    };

    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                userData={user}
                onLogout={handleLogout}
            />
            <div className="profile-page">
                <h2>Manage Profile</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="user-info">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <p>Role: {user.role}</p>
                    <p>Account Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Invalid Date'}</p>
                    <button className="update-profile-btn" onClick={handleUpdateUser}>
                        Update Profile
                    </button>
                </div>

                <div className="password-form">
                    <h3>Change Password</h3>
                    <label>
                        Current Password:
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </label>
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </label>
                    <button className="password-change-btn" onClick={handleChangePassword}>
                        Change Password
                    </button>
                </div>

                <div className="reviews-section">
                    <h3>Manage Reviews</h3>
                    <button
                        className="update-profile-btn"
                        onClick={handleNavigateToReviews}
                    >
                        Go to Manage Reviews
                    </button>
                </div>
            </div>
            <Footer />
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={(token) => {
                        handleLogin(token);
                        setShowLoginModal(false);
                    }}
                />
            )}
        </>
    );
};

export default ProfilePage;
