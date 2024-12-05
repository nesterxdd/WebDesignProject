import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/Pages/Homepage';
import Resources from './components/Pages/ResourcesPage';
import ProfilePage from './components/Pages/ProfilePage';
import { AuthProvider } from './utils/AuthContext'; // Import AuthProvider
import ReviewsPage from './components/Pages/ReviewsPage';
import ResourceDetailsPage from './components/Pages/ResourceDetailsPage';
function App() {
    return (
        <AuthProvider >
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-reviews" element={<ReviewsPage />} />
                   

                    <Route path="/resources/:resourceId" element={<ResourceDetailsPage />} />

            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;
