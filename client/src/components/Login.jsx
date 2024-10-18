import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error messages

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5555/login', { username, password });
            onLogin(response.data); // Call the onLogin function with the response data
        } catch (error) {
            // Improved error handling
            const errorMessage = error.response ? error.response.data.error : 'Login failed: An unknown error occurred';
            setError(errorMessage); // Set the error message to state
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if exists */}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ margin: '10px', padding: '10px' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '10px', padding: '10px' }}
            />
            <button onClick={handleLogin} style={{ padding: '10px 20px' }}>Login</button>
        </div>
    );
};

export default Login;