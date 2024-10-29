import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaUser } from 'react-icons/fa';

const Navbar = ({ onLogout, user, cartItemCount = 0 }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav style={styles.navbar}>
            <div style={styles.navContent}>
                <div style={styles.logo}>
                    <img 
                        src="https://cdn.dribbble.com/userupload/10056937/file/original-b185c3532b852114025434d4e2bd14dd.png?resize=1200x900" 
                        alt="Myjamii Logo" 
                        style={styles.logoImage}
                    />
                    <h1 style={styles.logoText}>Myjamii Stores</h1>
                </div>

                {/* Navbar Links */}
                <ul style={{ ...styles.navLinks, ...(isMenuOpen ? styles.navLinksOpen : {}) }}>
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

                    {/* Cart Icon with Item Count */}
                    <li style={styles.navItem}>
                        <Link to="/cart" style={styles.cartLink}>
                            <FaShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span style={styles.cartBadge}>{cartItemCount}</span>
                            )}
                        </Link>
                    </li>

                    {/* Admin Link */}
                    {user && user.role === 'admin' && (
                        <li style={styles.navItem}>
                            <Link to="/admin-dashboard" style={styles.link}>Admin Dashboard</Link>
                        </li>
                    )}

                    {/* User Account Dropdown */}
                    <li style={styles.navItem}>
                        {user ? (
                            <div style={styles.userContainer}>
                                <span style={styles.userText} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <FaUser /> {user.username}
                                </span>
                                {isDropdownOpen && (
                                    <div style={styles.dropdown}>
                                        <button onClick={onLogout} style={styles.logoutButton}>Log Out</button>
                                    </div>
                                )}
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
        flexWrap: 'wrap',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
    },
    logoImage: {
        width: '40px',
        height: '40px',
        marginRight: '10px',
        borderRadius: '50%',
    },
    logoText: {
        fontSize: '24px',
        color: '#fff',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyleType: 'none',
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        transition: 'transform 0.3s ease-in-out',
    },
    navLinksOpen: {
        display: 'block',
    },
    navItem: {
        margin: '0 15px',
        position: 'relative',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
        transition: 'color 0.3s ease',
    },
    linkHover: {
        color: '#aaa',
    },
    cartLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        transition: 'color 0.3s ease',
    },
    cartBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-10px',
        backgroundColor: '#ff4444',
        color: '#fff',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '12px',
    },
    hamburger: {
        display: 'none',
        cursor: 'pointer',
        color: '#fff',
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
    },
    userText: {
        fontSize: '16px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    dropdown: {
        position: 'absolute',
        top: '30px',
        right: 0,
        backgroundColor: '#333',
        borderRadius: '5px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
    },
    dropdownItem: {
        padding: '10px 20px',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },

    // Media query for responsive design
    '@media (max-width: 768px)': {
        navLinks: {
            flexDirection: 'column',
            alignItems: 'center',
            display: 'none',
        },
        navLinksOpen: {
            display: 'flex',
            backgroundColor: '#333',
            padding: '10px 0',
            position: 'absolute',
            top: '60px',
            width: '100%',
            left: 0,
        },
    },
};

export default Navbar;