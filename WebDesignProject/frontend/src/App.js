import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/Pages/Homepage';
import Resources from './components/Pages/ResourcesPage';
import ProfilePage from './components/Pages/ProfilePage';
import { AuthProvider } from './utils/AuthContext'; // Import AuthProvider
import ReviewsPage from './components/Pages/ReviewsPage';
import ResourceDetailsPage from './components/Pages/ResourceDetailsPage';
import CategoryManagementPage from './components/Pages/CategoryManagementPage';

import AdminPanel from './components/Pages/AdminPanel';

import TeacherPanel from './components/Pages/TeacherPanel';
import ManageUsersPage from './components/Pages/ManageUsersPage';

import CreateResourcePage from './components/Pages/CreateResourcePage';
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
                    <Route path="/manage-categories" element={<CategoryManagementPage />} />
                    <Route path="/admin-panel" element={<AdminPanel />} />
                    <Route path="/teacher-panel" element={<TeacherPanel />} />
                    <Route path="/manage-users" element={<ManageUsersPage />} />
                    <Route path="/create-resource" element={<CreateResourcePage />} />



            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;
