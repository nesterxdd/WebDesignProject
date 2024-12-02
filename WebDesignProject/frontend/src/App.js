import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/Pages/Homepage';
import Resources from './components/Pages/ResourcesPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resources" element={<Resources />} />
            </Routes>
        </Router>
    );
}

export default App;
