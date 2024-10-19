import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5555/login', { username, password });
            onLogin(response.data.user);

            // Redirect based on user role
            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/'); // Redirecting all users to the home page
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : 'Login failed: An unknown error occurred';
            setError(errorMessage);
        }
    };

    return (
        <div style={{ 
            background: '#f9f9f9', 
            padding: '30px', 
            borderRadius: '10px', 
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', 
            width: '300px', 
            margin: '150px auto',
            textAlign: 'center' 
        }}>
            <h2 style={{ marginBottom: '20px' }}>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}
            />
            <button 
                onClick={handleLogin} 
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Login
            </button>
            <p style={{ marginTop: '10px' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default Login;
