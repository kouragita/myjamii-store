import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ onLogout, user }) => { // Accept user as a prop
    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <h1>Myjamii</h1>
            </div>
            <ul style={styles.navLinks}>
                <li style={styles.navItem}>
                    <Link to="/" style={styles.link}>Home</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/signup" style={styles.link}>Signup</Link>
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
                <li style={styles.navItem}>
                    {user ? (
                        <div>
                            <span style={styles.link}>Welcome, {user.username}</span>
                            <button onClick={onLogout} style={styles.link}>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" style={styles.link}>Login</Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
    },
    logo: {
        fontSize: '24px',
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
    },
    cartLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
    },
};

export default Navbar;