import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

function HomePage() {
  const navigate = useNavigate();

  const images = [
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGMsreLavs85BsvcYp7ctra4eumvdwSBckzg&s', label: 'Fresh Vegetables' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj_cZqXxf__rfB4QP9TTsS1e8UOEKSMDD2ag&s', label: 'Latest Electronics' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6XeRBIxFpQoX1_Dqj40LdAoN4UGblgST3NQ&s', label: 'Luxury Cars' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5V079hXIUDpXy0uv5OGGqSmRDfzagPDiM5Q&s', label: 'Premium Yachts' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvExeTfP4lCyLOotK6QTLzbN6xBsab2j2qow&s', label: 'Private Planes' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJdYZT0bJZnSg8Q6oUGfaGe15-EYLjE5LneQ&s', label: 'Delicious Snacks' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.carouselContainer}>
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          dynamicHeight
          showArrows // Enable arrows for manual navigation
        >
          {images.map((image, index) => (
            <div key={index} style={styles.slide}>
              <img src={image.src} alt={image.label} style={styles.image} />
              <div style={styles.overlay}>
                <h1 style={styles.fadeIn}>Welcome to MyJamii Stores</h1>
                <p style={styles.fadeIn}>{image.label}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div style={styles.content}>
        <p>We're excited to have you here! Explore our vast selection of unique products crafted just for you. Whether you're looking for the latest trends, timeless classics, or special gifts, we have something for everyone.</p>
        <p>Thank you for choosing us 😊. Happy shopping!</p>
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
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  carouselContainer: {
    width: '100%',
    maxWidth: '1000px',
    marginBottom: '30px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
  },
  slide: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    animation: 'fadeIn 1.5s ease-in-out',
  },
  fadeIn: {
    animation: 'fadeIn 1.5s ease-in-out',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  content: {
    textAlign: 'center',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    fontSize: '18px',
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
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#555',
    transform: 'scale(1.05)',
  },
};

export default HomePage;