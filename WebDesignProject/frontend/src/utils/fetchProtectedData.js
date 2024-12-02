// utils/fetchProtectedData.js
export const fetchProtectedData = async () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch('http://localhost:5054/api/protected-resource', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return await response.json();
};
