import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faTshirt, faHome, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>About Our E-commerce Platform</h1>

        <div style={styles.section}>
          <p style={styles.description}>
            Welcome to our e-commerce platform, where we offer a wide range of products for all your needs.
            Our aim is to provide <strong style={styles.highlight}>high-quality products</strong>, 
            <strong style={styles.highlight}> excellent customer service</strong>, and a <strong style={styles.highlight}>seamless shopping experience</strong>.
          </p>
        </div>

        <div style={styles.iconContainer}>
          <div style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faLaptop} style={styles.icon} />
            <p>Electronics</p>
          </div>
          <div style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faTshirt} style={styles.icon} />
            <p>Clothing</p>
          </div>
          <div style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faHome} style={styles.icon} />
            <p>Household</p>
          </div>
        </div>

        <div style={styles.section}>
          <p style={styles.description}>
            As a <strong style={styles.highlight}>customer-centric platform</strong>, we strive to continually improve and expand our product offerings.
            Whether you're looking for the latest trends or timeless classics, we have something for everyone!
          </p>
        </div>

        <div style={styles.contact}>
          <h2 style={styles.contactHeading}>Contact Us</h2>
          <p><FontAwesomeIcon icon={faEnvelope} /> Email: support@myjamiistores.com</p>
          <p><FontAwesomeIcon icon={faPhone} /> Phone: 0712345678 / 0787654321</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1s ease', // Subtle animation
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  section: {
    marginBottom: '20px',
  },
  description: {
    fontSize: '1rem',
    color: '#555',
  },
  highlight: {
    color: '#333',
    fontWeight: 'bold',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '20px',
    marginBottom: '30px',
  },
  iconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#333',
  },
  icon: {
    fontSize: '40px',
    color: '#23527c', // Custom color for icons
    marginBottom: '5px',
  },
  contact: {
    marginTop: '30px',
    paddingTop: '10px',
    borderTop: '1px solid #ddd',
  },
  contactHeading: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
};

export default About;