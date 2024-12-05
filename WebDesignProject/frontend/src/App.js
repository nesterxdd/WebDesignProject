import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/Pages/Homepage';
import Resources from './components/Pages/ResourcesPage';
import ProfilePage from './components/Pages/ProfilePage';
import { AuthProvider } from './utils/AuthContext'; // Import AuthProvider

function App() {
    return (
        <AuthProvider >
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;
