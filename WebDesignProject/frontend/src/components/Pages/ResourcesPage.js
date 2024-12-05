import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AuthContext } from '../../utils/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../GeneralComponents/Header';
import Footer from '../GeneralComponents/Footer';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import './ResourcePage.css';

const ResourcesPage = () => {
    const { userToken, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize navigate for redirection

    const [resources, setResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ comment: '', rating: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Fetch all resources
    useEffect(() => {
        const fetchResources = async () => {
            if (!userToken) {
                setError('No token found. Please log in.');
                return;
            }

            try {
                const response = await axiosInstance.get('/resource', {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setResources(response.data);
                setError('');
            } catch (err) {
                setError('Error fetching resources: ' + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchResources();
    }, [userToken]);

    // Handle redirection to resource details
    const handleResourceClick = (resourceId) => {
        navigate(`/resources/${resourceId}`); // Redirect to the resource details page
    };

    // Fetch reviews for a selected resource
    const fetchResourceReviews = async (resourceId) => {
        try {
            const response = await axiosInstance.get(`/resource/${resourceId}/reviews`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setReviews(response.data);
            setSelectedResource(resources.find((res) => res.id === resourceId));
            setError('');
        } catch (err) {
            setError('Error fetching reviews: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    // Add a new review
    const handleAddReview = async () => {
        if (!newReview.comment || !newReview.rating) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/api/reviews`,
                {
                    comment: newReview.comment,
                    rating: parseInt(newReview.rating),
                    resourceId: selectedResource.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setReviews((prev) => [...prev, response.data]);
            setNewReview({ comment: '', rating: '' });
            setSuccess('Review added successfully.');
            setError('');
        } catch (err) {
            setError('Error adding review: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    return (
        <>
            <Header
                isLoggedIn={!!userToken}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                onLogout={handleLogout}
            />
            <div className="resource-page">
                <main className="content">
                    {!selectedResource ? (
                        <>
                            <h1>All Resources</h1>
                            {error && <p className="error-message">{error}</p>}
                            <div className="resources-list">
                                {resources.length > 0 ? (
                                    resources.map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="resource-item"
                                            onClick={() => handleResourceClick(resource.id)} // Redirect to resource details
                                        >
                                            <h2>{resource.title}</h2>
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
                                        </div>
                                    ))
                                ) : (
                                    !error && <p>No resources found.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>Resource Details</h1>
                            <button onClick={() => setSelectedResource(null)}>Back to Resources</button>
                            {error && <p className="error-message">{error}</p>}
                            {success && <p className="success-message">{success}</p>}
                            <div className="resource-details">
                                <h2>{selectedResource.title}</h2>
                                <p>{selectedResource.description}</p>
                                <p>
                                    Categories:{" "}
                                    {selectedResource.categories?.map((category) => category.name).join(", ") || "None"}
                                </p>
                                <p>
                                    Created At:{" "}
                                    {selectedResource.createdAt
                                        ? new Date(selectedResource.createdAt).toLocaleDateString()
                                        : "Invalid Date"}
                                </p>
                            </div>
                            <div className="reviews-section">
                                <h2>Reviews</h2>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="review-item">
                                            <p>Rating: {review.rating}</p>
                                            <p>Comment: {review.comment}</p>
                                            <p>
                                                Last Action:{" "}
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
                    )}
                </main>
            </div>
            <Footer />
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={() => window.location.reload()}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onRegisterSuccess={(message) => alert(message)}
                />
            )}
        </>
    );
};

export default ResourcesPage;
