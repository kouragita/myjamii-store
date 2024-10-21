import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>Welcome to MyJamii Stores</h1>
        <p>We're excited to have you here! Explore our vast selection of unique products crafted just for you.<br></br> Whether you're looking for the latest trends, timeless classics, or special gifts, we have something for everyone.</p>
        <p>Thank you for choosing us😊. Happy shopping!</p>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => navigate('/products')}>Shop Now</button>
          <button style={styles.button} onClick={() => navigate('/about')}>Learn More</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
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
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#23527c',
  },
};

export default HomePage;