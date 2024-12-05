import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import './ResourceDetailsPage.css';

const ResourceDetailsPage = () => {
    const { userToken, handleLogin, handleLogout } = useContext(AuthContext);
    const isLoggedIn = !!userToken;

    const { resourceId } = useParams();
    const navigate = useNavigate();

    const [resource, setResource] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isAdmin, setIsAdminOrTeacher] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newReview, setNewReview] = useState({ comment: '', rating: '' });
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        const fetchResourceDetails = async () => {
            try {
                const resourceResponse = await axiosInstance.get(`/resource/${resourceId}`);
                setResource(resourceResponse.data);
                setSelectedCategories(resourceResponse.data.categories.map((c) => c.id));

                const reviewsResponse = await axiosInstance.get(`/resource/${resourceId}/reviews`);
                setReviews(reviewsResponse.data);

                const categoriesResponse = await axiosInstance.get('/categories', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setCategories(categoriesResponse.data);

                const userResponse = await axiosInstance.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                const role = userResponse.data.role;
                setIsAdminOrTeacher(role === 'admin');
                setCurrentUserId(userResponse.data.id);
            } catch (err) {
                setError('Error fetching resource details: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchResourceDetails();
    }, [resourceId, userToken]);

    const handleAssignCategories = async () => {
        if (!selectedCategories.length) {
            setError('Please select at least one category.');
            return;
        }

        try {
            // Make the PUT request with the current resource title and selected categories
            await axiosInstance.put(
                `/resource/${resourceId}`,
                {
                    title: resource.title, // Include the current title of the resource
                    categoriesIDs: selectedCategories, // Assign selected categories
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            setSuccess('Categories assigned successfully.');
            setError('');
        } catch (err) {
            console.error('Error assigning categories:', err.response || err.message);
            setError(err.response?.data?.message || 'Error assigning categories.');
            setSuccess('');
        }
    };


    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    };

    const handleAddReview = async () => {
        if (!newReview.comment || !newReview.rating) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const userResponse = await axiosInstance.get('/users/me', {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            const userName = userResponse.data.name;

            const response = await axiosInstance.post(
                `/reviews`,
                {
                    comment: newReview.comment,
                    rating: parseInt(newReview.rating),
                    resourceId: parseInt(resourceId),
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            setReviews((prev) => [...prev, { ...response.data, userName }]);
            setNewReview({ comment: '', rating: '' });
            setSuccess('Review added successfully.');
            setError('');
        } catch (err) {
            console.error('Error adding review:', err.response || err.message);
            setError(err.response?.data?.message || 'Error adding review.');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axiosInstance.delete(`/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
            setSuccess('Review deleted successfully.');
            setError('');
        } catch (err) {
            console.error('Error deleting review:', err.response || err.message);
            setError(err.response?.data?.message || 'Error deleting review.');
        }
    };

    const handleEditReview = (review) => setEditingReview(review);

    const handleSaveEditedReview = async () => {
        try {
            const response = await axiosInstance.put(
                `/reviews/${editingReview.id}`,
                {
                    comment: editingReview.comment,
                    rating: editingReview.rating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setReviews((prev) =>
                prev.map((review) => (review.id === editingReview.id ? response.data : review))
            );
            setEditingReview(null);
            setSuccess('Review updated successfully.');
            setError('');
        } catch (err) {
            console.error('Error updating review:', err.response || err.message);
            setError(err.response?.data?.message || 'Error updating review.');
        }
    };

    return (
        <div className="resource-details-page">
            <Header
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                onLogout={handleLogout}
            />
            <main className="content">
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                {resource ? (
                    <>
                        <h1>{resource.title}</h1>
                        <p>{resource.description}</p>
                        <p>
                            Categories:{" "}
                            {resource.categories?.map((category) => category.name).join(", ") || "None"}
                        </p>
                        <button onClick={() => navigate(-1)}>Back to Resources</button>

                        {isAdmin && (
                            <div className="category-management">
                                <h2>Manage Categories</h2>
                                <div className="existing-categories">
                                    {categories.map((category) => (
                                        <label key={category.id}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleCategoryChange(category.id)}
                                            />
                                            {category.name}
                                        </label>
                                    ))}
                                </div>
                                <button onClick={handleAssignCategories}>Assign Categories</button>
                            </div>
                        )}

                        <div className="reviews-section">
                            <h2>Reviews</h2>
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    {editingReview?.id === review.id ? (
                                        <>
                                            <textarea
                                                value={editingReview.comment}
                                                onChange={(e) =>
                                                    setEditingReview({ ...editingReview, comment: e.target.value })
                                                }
                                            />
                                            <input
                                                type="number"
                                                value={editingReview.rating}
                                                onChange={(e) =>
                                                    setEditingReview({ ...editingReview, rating: e.target.value })
                                                }
                                                min="1"
                                                max="5"
                                            />
                                            <button onClick={handleSaveEditedReview}>Save</button>
                                            <button onClick={() => setEditingReview(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Author:</strong> {review.userName}</p>
                                            <p><strong>Rating:</strong> {review.rating}</p>
                                            <p><strong>Comment:</strong> {review.comment}</p>
                                            {isAdmin || review.userId === currentUserId ? (
                                                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                            ) : null}
                                            {review.userId === currentUserId && (
                                                <button onClick={() => handleEditReview(review)}>Edit</button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="add-review">
                            <h2>Add Your Review</h2>
                            <textarea
                                placeholder="Write your review..."
                                value={newReview.comment}
                                onChange={(e) =>
                                    setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                                }
                            />
                            <input
                                type="number"
                                placeholder="Rating (1-5)"
                                value={newReview.rating}
                                onChange={(e) =>
                                    setNewReview((prev) => ({ ...prev, rating: e.target.value }))
                                }
                                min="1"
                                max="5"
                            />
                            <button onClick={handleAddReview}>Submit Review</button>
                        </div>
                    </>
                ) : (
                    <p>Loading resource details...</p>
                )}
            </main>
            <Footer />
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLogin}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onRegisterSuccess={(message) => alert(message)}
                />
            )}
        </div>
    );
};

export default ResourceDetailsPage;
