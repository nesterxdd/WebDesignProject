// utils/authService.js
export const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:5054/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    const data = await response.json();
    const token = data.token; // JWT token

    // Save the token to localStorage (or sessionStorage)
    localStorage.setItem('jwtToken', token);

    return token;
};
