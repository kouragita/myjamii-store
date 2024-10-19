import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ onLogout, user }) => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.navContent}>
                <div style={styles.logo}>
                    <h1>Myjamii</h1>
                </div>
                <ul style={styles.navLinks}>
                    <li style={styles.navItem}>
                        <Link to="/" style={styles.link}>Home</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/signup" style={styles.link}>Sign Up</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/products" style={styles.link}>Products</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/about" style={styles.link}>About</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/cart" style={styles.cartLink}>
                            <FaShoppingCart size={20} />
                        </Link>
                    </li>
                    {user && user.role === 'admin' && (
                        <li style={styles.navItem}>
                            <Link to="/admin-dashboard" style={styles.link}>Admin Dashboard</Link>
                        </li>
                    )}
                    <li style={styles.navItem}>
                        {user ? (
                            <div style={styles.userContainer}>
                                <span style={styles.userText}>Welcome, {user.username}</span>
                                <button onClick={onLogout} style={styles.logoutButton}>Log Out</button>
                            </div>
                        ) : (
                            <Link to="/login" style={styles.link}>Sign In</Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#333',
        color: '#fff',
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: '10px 0',
        zIndex: 1000,
    },
    navContent: {
        width: '90%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        color: '#fff',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyleType: 'none',
        display: 'flex',
        margin: 0,
        padding: 0,
    },
    navItem: {
        margin: '0 15px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
        transition: 'color 0.3s ease',
    },
    cartLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.3s ease',
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    userText: {
        marginRight: '10px',
        fontSize: '16px',
        color: '#fff',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '14px',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },
};

export default Navbar;