import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Assuming you're using React Router for navigation

const Signup = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('https://myjamii-store.onrender.com/signup', { username, email, password });
            setSuccess(response.data.message);
            onSignup(response.data);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError('Signup failed: ' + (error.response?.data?.error || 'An error occurred'));
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
            <h2 style={{ marginBottom: '20px' }}>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
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
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}
                required
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
                required
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}
                required
            />
            <button 
                onClick={handleSignup} 
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
                Signup
            </button>

            {/* Link to Login */}
            <p style={{ marginTop: '20px' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#333', textDecoration: 'underline' }}>
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default Signup;
