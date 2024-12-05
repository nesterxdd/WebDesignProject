import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import './ProfilePage.css';

const ProfilePage = () => {
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

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                setError('Error fetching user data: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchUserData();
    }, []);

    // Handle input changes for user profile
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle input changes for password form
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    // Update user profile
    const handleUpdateUser = async () => {
        const updateData = {
            name: user.name,
            email: user.email,
        };

        try {
            const response = await axiosInstance.put(`/users/${user.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
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

    // Update password
    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setSuccess('');
            return;
        }

        try {
            await axiosInstance.put(`/users/update-password/${user.id}`, passwordData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
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

    return (
        <>
            <Header isLoggedIn={true} userData={user} />
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
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
