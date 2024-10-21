import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'; // Import Google icon

const Signup = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false); // Form visibility state

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

    const handleGoogleSignup = () => {
        window.location.href = 'https://accounts.google.com/InteractiveLogin/signinchooser?service=mail';
    };

    return (
        <div style={styles.container}>
            {/* Add the logo at the top */}
            <img 
                src="https://cdn.dribbble.com/userupload/10056937/file/original-b185c3532b852114025434d4e2bd14dd.png?resize=1200x900" 
                alt="Myjamii Logo" 
                style={styles.logo}
            />
            <h2 style={{ marginBottom: '20px' }}>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* Google Signup Button */}
            <button onClick={handleGoogleSignup} style={styles.googleButton}>
                <FaGoogle style={{ marginRight: '10px' }} /> Sign up with Google
            </button>

            <div style={styles.orSeparator}>
                <hr style={styles.hr} />
                <span style={styles.orText}>or</span>
                <hr style={styles.hr} />
            </div>

            {!isFormVisible && (
                <button onClick={() => setIsFormVisible(true)} style={styles.signupButton}>
                    Create Account Now
                </button>
            )}

            {isFormVisible && (
                <>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleSignup} style={styles.signupButton}>
                        Signup
                    </button>
                </>
            )}

            <p style={{ marginTop: '20px' }}>
                Already have an account?{' '}
                <Link to="/login" style={styles.link}>
                    Log in
                </Link>
            </p>
        </div>
    );
};

const styles = {
    container: {
        background: '#f9f9f9',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
        margin: '150px auto',
        textAlign: 'center',
    },
    logo: {
        width: '40px',
        height: '40px',
        marginBottom: '20px',
        borderRadius: '50%', // Optional circular shape
    },
    googleButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4285F4',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
    },
    orSeparator: {
        margin: '20px 0',
        display: 'flex',
        alignItems: 'center',
    },
    hr: {
        flexGrow: 1,
        border: 'none',
        borderTop: '1px solid #ccc',
    },
    orText: {
        padding: '0 10px',
        color: '#999',
    },
    signupButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default Signup;