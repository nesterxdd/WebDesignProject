import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import './CreateResourcePage.css';

const CreateResourcePage = () => {
    const { userToken, handleLogout, userData } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        metadata: '', // Adding Metadata field as required by the backend
        categoryIds: [],
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

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
                console.error('Error fetching categories:', err.response || err.message);
                setError(err.response?.data?.message || 'Error fetching categories.');
            }
        };

        fetchCategories();
    }, [userToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewResource((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setNewResource((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        }));
    };

    const handleCreateResource = async () => {
        if (!newResource.title || !newResource.description || !newResource.metadata) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await axiosInstance.post(
                '/resource',
                {
                    title: newResource.title,
                    description: newResource.description,
                    metadata: newResource.metadata, // Including the required Metadata field
                    categoriesIDs: newResource.categoryIds,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setSuccess('Resource created successfully.');
            setError('');
            setNewResource({ title: '', description: '', metadata: '', categoryIds: [] });
        } catch (err) {
            console.error('Error creating resource:', err.response || err.message);
            setError(err.response?.data?.message || 'Error creating resource.');
            setSuccess('');
        }
    };

    return (
        <div className="create-resource-page">
            <Header
                isLoggedIn={!!userToken}
                onLoginClick={() => { }}
                onRegisterClick={() => { }}
                onLogout={handleLogout}
                userData={userData}
            />
            <main className="content">
                <h1>Create a New Resource</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-container">
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={newResource.title}
                            onChange={handleInputChange}
                            placeholder="Enter resource title"
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={newResource.description}
                            onChange={handleInputChange}
                            placeholder="Enter resource description"
                            rows="4"
                        />
                    </label>
                    <label>
                        Metadata:
                        <input
                            type="text"
                            name="metadata"
                            value={newResource.metadata}
                            onChange={handleInputChange}
                            placeholder="Enter resource metadata"
                        />
                    </label>
                    <h2>Assign Categories</h2>
                    <div className="categories-list">
                        {categories.map((category) => (
                            <label key={category.id} className="category-checkbox">
                                <input
                                    type="checkbox"
                                    checked={newResource.categoryIds.includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                    <button className="create-resource-btn" onClick={handleCreateResource}>
                        Create Resource
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateResourcePage;
