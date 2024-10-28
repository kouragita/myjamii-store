import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaApple, FaGooglePlay } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={footerContainerStyle}>
                {/* Column 1: Social Media */}
                <div style={columnStyle}>
                    <h3 style={columnHeaderStyle}>Follow Us</h3>
                    <a href="https://www.facebook.com/" style={iconLinkStyle}>
                        <FaFacebook style={iconStyle} /> Facebook
                    </a>
                    <a href="https://x.com/i/flow/login" style={iconLinkStyle}>
                        <FaTwitter style={iconStyle} /> Twitter
                    </a>
                    <a href="https://www.instagram.com/accounts/login/?next=https%3A%2F%2Faccountscenter.instagram.com%2F%3Fentry_point%3Dapp_settings%26__coig_login%3D1" style={iconLinkStyle}>
                        <FaInstagram style={iconStyle} /> Instagram
                    </a>
                </div>

                {/* Column 2: About */}
                <div style={columnStyle}>
                    <h3 style={columnHeaderStyle}>About Us</h3>
                    <Link to="/about" style={linkStyle}>About Us</Link>
                    <p style={linkStyle}>Careers</p>
                    <p style={linkStyle}>Blog</p>
                </div>

                {/* Column 3: Legal */}
                <div style={columnStyle}>
                    <h3 style={columnHeaderStyle}>Legal</h3>
                    <p style={linkStyle}>Terms of Service</p>
                    <p style={linkStyle}>Privacy Policy</p>
                    <p style={linkStyle}>Cookie Policy</p>
                </div>

                {/* Column 4: App Downloads */}
                <div style={columnStyle}>
                    <h3 style={columnHeaderStyle}>Get Our App</h3>
                    <a href="https://play.google.com/store/search?q=pubg&c=apps&hl=en" style={iconLinkStyle}>
                        <FaApple style={iconStyle} /> App Store.
                    </a>
                    <a href="https://play.google.com/store/search?q=call+of+duty&c=apps&hl=en" style={iconLinkStyle}>
                        <FaGooglePlay style={iconStyle} /> Play Store.
                    </a>
                </div>
            </div>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
};

const footerContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
};

const columnStyle = {
    flex: '1',
    minWidth: '200px',
    marginBottom: '20px',
};

const columnHeaderStyle = {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#fff',
};

const iconLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#fff',
    marginBottom: '10px',
    fontSize: '16px',
};

const linkStyle = {
    fontSize: '14px',
    color: '#ccc',
    marginBottom: '10px',
    textDecoration: 'none',
};

const iconStyle = {
    marginRight: '8px',
    fontSize: '20px',
};

// Responsive Styles for Mobile
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
    footerContainerStyle.flexDirection = 'column';
    footerContainerStyle.alignItems = 'center';
}

export default Footer;