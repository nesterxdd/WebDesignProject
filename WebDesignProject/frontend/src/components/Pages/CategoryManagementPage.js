import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import './CategoryManagementPage.css';

const CategoryManagementPage = () => {
    const { userToken, handleLogin, handleLogout } = useContext(AuthContext);
    const isLoggedIn = !!userToken;

    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setCategories(response.data);
            } catch (err) {
                setError('Error fetching categories: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        if (isLoggedIn) fetchCategories();
    }, [isLoggedIn, userToken]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            setError('Category name cannot be empty.');
            return;
        }

        try {
            const response = await axiosInstance.post(
                '/categories',
                { name: newCategoryName },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            setCategories((prev) => [...prev, response.data]);
            setNewCategoryName('');
            setSuccess('Category added successfully.');
            setError('');
        } catch (err) {
            console.error('Error adding category:', err.response || err.message);
            setError(err.response?.data?.message || 'Error adding category.');
        }
    };

    const handleEditCategory = async () => {
        if (!editingCategoryName.trim()) {
            setError('Category name cannot be empty.');
            return;
        }

        try {
            const response = await axiosInstance.put(
                `/categories/${editingCategoryId}`,
                { name: editingCategoryName },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            setCategories((prev) =>
                prev.map((category) =>
                    category.id === editingCategoryId ? response.data : category
                )
            );
            setEditingCategoryId(null);
            setEditingCategoryName('');
            setSuccess('Category updated successfully.');
            setError('');
        } catch (err) {
            console.error('Error updating category:', err.response || err.message);
            setError(err.response?.data?.message || 'Error updating category.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axiosInstance.delete(`/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            setCategories((prev) => prev.filter((category) => category.id !== categoryId));
            setSuccess('Category deleted successfully.');
            setError('');
        } catch (err) {
            console.error('Error deleting category:', err.response || err.message);
            setError(err.response?.data?.message || 'Error deleting category.');
        }
    };

    return (
        <div className="category-management-page">
            <Header
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
            />
            <main className="content">
                <h1>Manage Categories</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="add-category">
                    <h2>Add Category</h2>
                    <input
                        type="text"
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <button onClick={handleAddCategory}>Add</button>
                </div>

                <div className="category-list">
                    <h2>Existing Categories</h2>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="category-item">
                                {editingCategoryId === category.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                        />
                                        <button onClick={handleEditCategory}>Save</button>
                                        <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{category.name}</span>
                                        <button onClick={() => {
                                            setEditingCategoryId(category.id);
                                            setEditingCategoryName(category.name);
                                        }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No categories found.</p>
                    )}
                </div>
            </main>
            <Footer />
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLogin}
                />
            )}
        </div>
    );
};

export default CategoryManagementPage;
