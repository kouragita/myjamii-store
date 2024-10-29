import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  const navigate = useNavigate();

  const images = [
    { src: 'https://static.wixstatic.com/media/19ad19_0ef8b910c8ed457582c1c43d09253483~mv2.png/v1/fill/w_568,h_388,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/19ad19_0ef8b910c8ed457582c1c43d09253483~mv2.png', label: 'Fresh Vegetables - Farm to Table Quality!' },
    { src: 'https://www.polytechnichub.com/wp-content/uploads/2017/04/Electronic.jpg', label: 'Latest Electronics - Upgrade Your Tech Game!' },
    { src: 'https://hips.hearstapps.com/hmg-prod/images/new-cars-2022-1631371525.jpg?crop=1xw:0.8554147465437788xh;center,top&resize=1200:*', label: 'Luxury Cars - Drive in Style!' },
    { src: 'https://biz-file.com/c/2404/735326-1000x520.jpg', label: 'Stylish Clothes - Elevate Your Wardrobe!' },
    { src: 'https://images.bild.de/65141d3784ca7536a3c5aca3/f4129bb8b6afde75a9320f30cebaa61a,5fb29da6?w=992', label: 'Premium Yachts - Experience Luxury on Water!' },
    { src: 'https://i.ytimg.com/vi/ILNOsdc1mSA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAMXs1sfLmyu8qMxe62ePIsM3Oh1Q', label: 'Private Planes - Take Flight with Ease!' },
    { src: 'https://www.tastingtable.com/img/gallery/30-absolute-best-snacks-from-trader-joes-ranked/intro-1717522250.jpg', label: 'Delicious Snacks - Treat Yourself Anytime!' },
    { src: 'https://media-child.kellyvision-peterborough.co.uk/Upload/fldBlog/v-638197643474174092/shutterstock_1668941440.jpg?maxwidth=800&404=default&format=webp&quality=100', label: 'Home Appliances - Upgrade Your Living Space!' },
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
          showArrows
        >
          {images.map((image, index) => (
            <div key={index} style={styles.slide}>
              <img src={image.src} alt={image.label} style={styles.image} />
              <div style={styles.overlay}>
                <h1 style={{ ...styles.fadeIn, ...styles.overlayText }}>Welcome to MyJamii Stores</h1>
                <p style={{ ...styles.fadeIn, ...styles.overlayText }}>{image.label}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div style={styles.content}>
        <p>We're excited to have you here! Explore our vast selection of unique products crafted just for you. Whether you're looking for the latest trends, timeless classics, or special gifts, we have something for everyone.</p>
        <p>Thank you for choosing us 😊. Happy shopping!</p>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => navigate('/products')}>
            <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} /> Shop Now
          </button>
          <button style={styles.button} onClick={() => navigate('/about')}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} /> Learn More
          </button>
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
    height: '50vh',
    maxHeight: '400px',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.7) 100%)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    animation: 'fadeIn 1.5s ease-in-out',
  },
  overlayText: {
    color: '#fff',
    textShadow: '0px 2px 5px rgba(0, 0, 0, 0.8)',
  },
  fadeIn: {
    animation: 'fadeIn 1.5s ease-in-out',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  carouselButton: {
    marginTop: '10px',
    backgroundColor: '#ff8c00',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#ff6600',
    },
  },
  content: {
    textAlign: 'center',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    fontSize: '18px',
    animation: 'fadeIn 1s ease-in-out',
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
};

export default HomePage;