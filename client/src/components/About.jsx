// src/components/About.jsx
import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
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
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  },
};

export default About;