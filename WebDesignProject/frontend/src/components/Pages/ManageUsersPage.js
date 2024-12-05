import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import axiosInstance from '../../utils/axiosInstance';
import './ManageUsersPage.css';

const ManageUsersPage = () => {
    const { userToken, handleLogout, userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', password: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/users', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Error fetching users: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchUsers();
    }, [userToken]);

    const handleDeleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setUsers((prev) => prev.filter((user) => user.id !== userId));
            setSuccess('User deleted successfully.');
            setError('');
        } catch (err) {
            console.error('Error deleting user:', err.response || err.message);
            setError(err.response?.data?.message || 'Error deleting user.');
            setSuccess('');
        }
    };

    const handleEditUser = (user) => setEditingUser(user);

    const handleSaveEditedUser = async () => {
        try {
            const payload = {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                password: editingUser.password || undefined, // Send the password only if it has been changed
            };

            const response = await axiosInstance.put(
                `/users/${editingUser.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setUsers((prev) =>
                prev.map((user) => (user.id === editingUser.id ? response.data : user))
            );
            setEditingUser(null);
            setSuccess('User updated successfully.');
            setError('');
        } catch (err) {
            console.error('Error updating user:', err.response || err.message);
            setError(err.response?.data?.message || 'Error updating user.');
            setSuccess('');
        }
    };


    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            setError('Please fill in all fields for the new user.');
            return;
        }

        try {
            const response = await axiosInstance.post(
                '/users',
                {
                    name: newUser.name,
                    email: newUser.email,
                    passwordHash: newUser.password, // Match backend field name
                    role: newUser.role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setUsers((prev) => [...prev, response.data]);
            setNewUser({ name: '', email: '', role: 'user', password: '' });
            setSuccess('User created successfully.');
            setError('');
        } catch (err) {
            console.error('Error creating user:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error creating user.');
            setSuccess('');
        }
    };


    return (
        <div className="manage-users-page">
            <Header
                isLoggedIn={!!userToken}
                onLoginClick={() => navigate('/login')}
                onRegisterClick={() => navigate('/register')}
                onLogout={handleLogout}
                userData={userData}
            />
            <main className="content">
                <h1>Manage Users</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="users-list">
                    <h2>Users List</h2>
                    {users.map((user) => (
                        <div key={user.id} className="user-item">
                            {editingUser?.id === user.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) =>
                                            setEditingUser((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="Name"
                                    />
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) =>
                                            setEditingUser((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        placeholder="Email"
                                    />
                                    <input
                                        type="text"
                                        value={editingUser.password}
                                        onChange={(e) =>
                                            setEditingUser((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        placeholder="Password"
                                    />
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) =>
                                            setEditingUser((prev) => ({
                                                ...prev,
                                                role: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="user">User</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button onClick={handleSaveEditedUser}>Save</button>
                                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Password:</strong> {user.password}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    <button onClick={() => handleEditUser(user)}>Edit</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="create-user">
                    <h2>Create New User</h2>
                    <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                            setNewUser((prev) => ({ ...prev, password: e.target.value }))
                        }
                        placeholder="Password"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                    >
                        <option value="user">User</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button onClick={handleCreateUser}>Create User</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageUsersPage;
