import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faInfoCircle, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  const navigate = useNavigate();

  const images = [
    { 
      src: 'https://static.wixstatic.com/media/19ad19_0ef8b910c8ed457582c1c43d09253483~mv2.png/v1/fill/w_568,h_388,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/19ad19_0ef8b910c8ed457582c1c43d09253483~mv2.png', 
      label: 'Fresh Vegetables',
      subtitle: 'Farm to Table Quality!'
    },
    { 
      src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=600&fit=crop', 
      label: 'Latest Electronics',
      subtitle: 'Upgrade Your Tech Game!'
    },
    { 
      src: 'https://hips.hearstapps.com/hmg-prod/images/new-cars-2022-1631371525.jpg?crop=1xw:0.8554147465437788xh;center,top&resize=1200:*', 
      label: 'Luxury Cars',
      subtitle: 'Drive in Style!'
    },
    { 
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop', 
      label: 'Stylish Clothes',
      subtitle: 'Elevate Your Wardrobe!'
    },
    { 
      src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop', 
      label: 'Premium Yachts',
      subtitle: 'Experience Luxury on Water!'
    },
    { 
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop', 
      label: 'Private Planes',
      subtitle: 'Take Flight with Ease!'
    },
    { 
      src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&h=600&fit=crop', 
      label: 'Delicious Snacks',
      subtitle: 'Treat Yourself Anytime!'
    },
    { 
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop', 
      label: 'Home Appliances',
      subtitle: 'Upgrade Your Living Space!'
    },
  ];

  const features = [
    { icon: faShoppingCart, title: 'Easy Shopping', description: 'Browse and buy with just a few clicks' },
    { icon: faStar, title: 'Quality Products', description: 'Curated selection of premium items' },
    { icon: faArrowRight, title: 'Fast Delivery', description: 'Quick and reliable shipping worldwide' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Carousel Section */}
      <section className="relative">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl mx-4 mt-4 lg:mx-8">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              interval={4000}
              showArrows={true}
              className="relative"
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              }
            >
              {images.map((image, index) => (
                <div key={index} className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
                  <img 
                    src={image.src} 
                    alt={image.label} 
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle neutral overlay - much lighter */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-white"
                    >
                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
                        Welcome to MyJamii Stores
                      </h1>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 text-yellow-300 drop-shadow-lg">
                        {image.label}
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 drop-shadow-lg">
                        {image.subtitle}
                      </p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Welcome Content Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-12 sm:py-16 lg:py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6"
            >
              Your Premier Shopping Destination
            </motion.h2>
            
            <motion.div 
              variants={itemVariants}
              className="space-y-4 text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8"
            >
              <p>
                We're excited to have you here! Explore our vast selection of unique products 
                crafted just for you. Whether you're looking for the latest trends, timeless 
                classics, or special gifts, we have something for everyone.
              </p>
              <p className="flex items-center justify-center space-x-2">
                <span>Thank you for choosing us</span>
                <span className="text-2xl">😊</span>
                <span>Happy shopping!</span>
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Shop Now</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Learn More</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Why Choose MyJamii Stores?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Discover thousands of products across multiple categories
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Explore Products</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;