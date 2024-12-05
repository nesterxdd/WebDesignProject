import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import './ReviewsPage.css';

const ReviewsPage = () => {
    const { userToken, handleLogout, handleLogin } = useContext(AuthContext);
    const isLoggedIn = !!userToken;

    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [updatedReview, setUpdatedReview] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get('/users/me/reviews', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setReviews(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching reviews:', err.response || err.message);
                setError(err.response?.data?.message || 'Error fetching reviews.');
            }
        };

        fetchReviews();
    }, [isLoggedIn, userToken]);

    const handleEdit = (review) => {
        setEditingReviewId(review.id);
        setUpdatedReview({ ...review });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedReview((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axiosInstance.put(
                `/reviews/${editingReviewId}`,
                { comment: updatedReview.comment, rating: updatedReview.rating },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id === editingReviewId ? response.data : review
                )
            );
            setEditingReviewId(null);
            setSuccess('Review updated successfully.');
            setError('');
        } catch (err) {
            console.error('Error updating review:', err.response || err.message);
            setError(err.response?.data?.message || 'Error updating review.');
            setSuccess('');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axiosInstance.delete(`/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review.id !== reviewId)
            );
            setSuccess('Review deleted successfully.');
            setError('');
        } catch (err) {
            console.error('Error deleting review:', err.response || err.message);
            setError(err.response?.data?.message || 'Error deleting review.');
            setSuccess('');
        }
    };

    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
            />
            <div className="reviews-page">
                <h2>My Reviews</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        const lastAction = review.updatedAt ? new Date(review.updatedAt) : new Date(review.createdAt);
                        return (
                            <div key={review.id} className="review-item">
                                <h4>Resource ID: {review.resourceId}</h4>
                                <p>Rating:</p>
                                {editingReviewId === review.id ? (
                                    <input
                                        type="number"
                                        name="rating"
                                        value={updatedReview.rating}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                ) : (
                                    <p>{review.rating}</p>
                                )}
                                <p>Comment:</p>
                                {editingReviewId === review.id ? (
                                    <textarea
                                        name="comment"
                                        value={updatedReview.comment}
                                        onChange={handleInputChange}
                                        className="comment-input"
                                    />
                                ) : (
                                    <p>{review.comment}</p>
                                )}
                                <p>
                                    Last Action: {lastAction.toLocaleString()}
                                </p>
                                {editingReviewId === review.id ? (
                                    <button
                                        onClick={handleSaveChanges}
                                        className="save-btn"
                                    >
                                        Save Changes
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(review)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    })
                ) : (
                    !error && <p>No reviews found.</p>
                )}
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

export default ReviewsPage;
