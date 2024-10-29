import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faTshirt, faHome, faEnvelope, faPhone, faStar, faHeadset, faRocket } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>About Our E-commerce Platform</h1>

        {/* 10 - Storytelling Element with Enhanced About Statement */}
        <div style={styles.section}>
          <p style={styles.story}>
            <FontAwesomeIcon icon={faRocket} style={styles.iconInline} /> 
            Welcome to <strong style={styles.highlight}>MyJamii Stores</strong>, a platform designed with you in mind! 
            Our mission is to provide <FontAwesomeIcon icon={faStar} style={styles.iconInline} /> 
            <strong style={styles.highlight}>high-quality products</strong> that exceed expectations, 
            <FontAwesomeIcon icon={faHeadset} style={styles.iconInline} /> <strong style={styles.highlight}>dedicated customer service</strong>, 
            and a <strong style={styles.highlight}>seamless shopping experience</strong> from start to finish.
          </p>
        </div>

        {/* Product Categories */}
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

        {/* Description Section */}
        <div style={styles.section}>
          <p style={styles.description}>
            We believe in being a <strong style={styles.highlight}>customer-centric platform</strong>, continually enhancing our product 
            offerings and services. Whether you’re searching for the latest trends, innovative gadgets, 
            or timeless classics, <strong style={styles.highlight}>MyJamii Stores</strong> has something for everyone. 
            <FontAwesomeIcon icon={faStar} style={styles.iconInline} /> Our diverse selection, paired with a commitment to quality, 
            makes every shopping experience one to remember.
          </p>
        </div>

        {/* Customer Testimonials */}
        <div style={styles.section}>
          <h2 style={styles.testimonialHeading}>What Our Customers Say</h2>
          <div style={styles.testimonial}>
            <p>"I keep coming back to MyJamii Stores because they consistently deliver high-quality products and outstanding service. It's my go-to place for all my shopping needs!" - <strong>Jane D.</strong></p>
          </div>
          <div style={styles.testimonial}>
            <p>"After struggling to find the perfect Range Rover Sport SVR for months, I finally found it at MyJamii Stores. It not only met my expectations but exceeded them, and I felt valued as a customer throughout the entire process." - <strong>James Kinuthia.</strong></p>
          </div>
        </div>

        {/* Improved Contact Section with Links */}
        <div style={styles.contact}>
          <h2 style={styles.contactHeading}>Contact Us</h2>
          <p>
            <FontAwesomeIcon icon={faEnvelope} /> 
            <a href="mailto:support@myjamiistores.com" style={styles.contactLink}> support@myjamiistores.com</a>
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} /> 
            <a href="tel:0712345678" style={styles.contactLink}>0712345678</a> / 
            <a href="tel:0787654321" style={styles.contactLink}>0787654321</a>
          </p>
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
    animation: 'fadeIn 1s ease', 
  },
  content: {
    textAlign: 'center',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
    lineHeight: '1.3',
  },
  section: {
    marginBottom: '20px',
  },
  story: { 
    fontSize: '1rem',
    color: '#333',
    fontStyle: 'italic',
    marginBottom: '10px',
  },
  description: {
    fontSize: '1.1rem', 
    color: '#555',
    lineHeight: '1.5',
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
    flexWrap: 'wrap', 
  },
  iconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#333',
    minWidth: '100px', 
  },
  icon: {
    fontSize: '40px',
    color: '#23527c', 
    marginBottom: '5px',
  },
  iconInline: { 
    marginLeft: '5px',
    marginRight: '5px',
    color: '#ff8c00', // Custom color for inline icons
  },
  testimonialHeading: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  testimonial: {
    fontSize: '1rem',
    color: '#555',
    fontStyle: 'italic',
    marginBottom: '10px',
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
  contactLink: { 
    color: '#23527c',
    textDecoration: 'none',
  },
};

export default About;