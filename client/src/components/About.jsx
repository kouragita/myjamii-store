import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>About Our E-commerce Platform</h1>
        <p>
          Welcome to our e-commerce platform, where we offer a wide range of products for all your needs.
          Our mission is to provide high-quality products, excellent customer service, and a seamless shopping experience.
        </p>
        <p>
          As a customer-centric platform, we strive to continually improve and expand our product offerings.
          Whether you're looking for electronics, clothing, or household items, we have something for everyone!
        </p>
        <p>
          Thank you for choosing us for your shopping experience. If you have any questions, feel free to reach out.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height to center vertically
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
};

export default About;