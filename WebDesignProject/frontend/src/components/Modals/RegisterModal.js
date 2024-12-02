//const handleRegister = async () => {
//    try {
//        const response = await fetch('http://localhost:5000/api/auth/register', {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json',
//            },
//            body: JSON.stringify({ email, password }),
//        });

//        if (!response.ok) {
//            throw new Error('Registration failed. Please try again.');
//        }

//        // Handle successful registration (e.g., notify user)
//        alert('Registration successful! You can now log in.');
//        onClose();
//    } catch (err) {
//        setError(err.message);
//    }
//};
