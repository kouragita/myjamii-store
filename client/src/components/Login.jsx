import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'; // Import Google icon

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://myjamii-store.onrender.com/login', { username, password });
            onLogin(response.data.user);

            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            setError(error.response ? error.response.data.error : 'Login failed: An unknown error occurred');
        }
    };

    const handleGoogleLogin = () => {
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
            <h2 style={{ marginBottom: '20px' }}>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Google Sign-in Button */}
            <button onClick={handleGoogleLogin} style={styles.googleButton}>
                <FaGoogle style={{ marginRight: '10px' }} /> Sign in with Google
            </button>

            <div style={styles.orSeparator}>
                <hr style={styles.hr} />
                <span style={styles.orText}>or</span>
                <hr style={styles.hr} />
            </div>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleLogin} style={styles.loginButton}>
                Login
            </button>

            <p style={{ marginTop: '10px' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={styles.link}>
                    Sign Up
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
    loginButton: {
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

export default Login;