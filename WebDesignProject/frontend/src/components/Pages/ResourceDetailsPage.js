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

    const { resourceId } = useParams(); // Get resourceId from URL
    const navigate = useNavigate();

    const [resource, setResource] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ comment: '', rating: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        const fetchResourceDetails = async () => {
            try {
                const resourceResponse = await axiosInstance.get(`/resource/${resourceId}`);
                setResource(resourceResponse.data);

                const reviewsResponse = await axiosInstance.get(`/resource/${resourceId}/reviews`);
                setReviews(reviewsResponse.data);
            } catch (err) {
                setError('Error fetching resource details: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchResourceDetails();
    }, [resourceId]);

    const handleAddReview = async () => {
        if (!newReview.comment || !newReview.rating) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // Create a new review
            await axiosInstance.post(
                `/reviews`,
                {
                    comment: newReview.comment,
                    rating: parseInt(newReview.rating),
                    resourceId: parseInt(resourceId), // Include resourceId in the payload
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            // Fetch updated reviews to ensure userName is included
            const reviewsResponse = await axiosInstance.get(`/resource/${resourceId}/reviews`);
            setReviews(reviewsResponse.data);

            // Reset form and display success message
            setNewReview({ comment: '', rating: '' });
            setSuccess('Review added successfully.');
            setError('');
        } catch (err) {
            console.error('Error adding review:', err.response || err.message);
            setError(err.response?.data?.message || 'Error adding review.');
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
                        <p>
                            Created At:{" "}
                            {resource.createdAt
                                ? new Date(resource.createdAt).toLocaleDateString()
                                : "Invalid Date"}
                        </p>
                        <button onClick={() => navigate(-1)}>Back to Resources</button>

                        <div className="reviews-section">
                            <h2>Reviews</h2>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <p><strong>Author:</strong> {review.userName}</p>
                                        <p><strong>Rating:</strong> {review.rating}</p>
                                        <p><strong>Comment:</strong> {review.comment}</p>
                                        <p>
                                            <strong>Last Action:</strong>{" "}
                                            {review.updatedAt
                                                ? new Date(review.updatedAt).toLocaleString()
                                                : new Date(review.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews found for this resource.</p>
                            )}
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
