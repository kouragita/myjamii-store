import React from 'react';
import { motion } from 'framer-motion';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faUsers, 
  faGlobe, 
  faShieldAlt, 
  faStar, 
  faRocket,
  faLeaf,
  faHandshake,
  faAward,
  faComments
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
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

  // About Us Carousel Images
  const aboutImages = [
    {
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=500&fit=crop',
      title: 'Our Amazing Team',
      description: 'Passionate professionals working together to create exceptional experiences'
    },
    {
      src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=500&fit=crop',
      title: 'Innovation at Work',
      description: 'Cutting-edge technology and creative solutions driving our success'
    },
    {
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop',
      title: 'Global Reach',
      description: 'Connecting customers worldwide with quality products and services'
    },
    {
      src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=500&fit=crop',
      title: 'Customer Success',
      description: 'Every smile represents our commitment to exceptional customer service'
    },
    {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=500&fit=crop',
      title: 'Quality Focus',
      description: 'Rigorous quality control ensures every product meets our high standards'
    },
    {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=500&fit=crop',
      title: 'Sustainable Future',
      description: 'Building a better tomorrow through eco-friendly practices and innovation'
    }
  ];

  const values = [
    {
      icon: faHeart,
      title: "Customer First",
      description: "Every decision we make starts with our customers in mind",
      color: "text-red-500"
    },
    {
      icon: faShieldAlt,
      title: "Quality Assured",
      description: "We guarantee the highest quality products and services",
      color: "text-blue-500"
    },
    {
      icon: faLeaf,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and sustainable growth",
      color: "text-green-500"
    },
    {
      icon: faHandshake,
      title: "Trust & Integrity",
      description: "Building lasting relationships through honest business practices",
      color: "text-purple-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: faUsers },
    { number: "100+", label: "Countries Served", icon: faGlobe },
    { number: "99.9%", label: "Uptime Guarantee", icon: faRocket },
    { number: "24/7", label: "Customer Support", icon: faAward }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      quote: "Leading innovation in e-commerce"
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      quote: "Building the future of online shopping"
    },
    {
      name: "Marcus Williams",
      role: "Head of Customer Experience",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      quote: "Ensuring every customer feels valued"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-700 text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            About MyJamii Stores
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
          >
            Connecting communities through exceptional shopping experiences since 2020
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faStar} className="text-3xl text-yellow-300" />
          </motion.div>
        </div>
      </motion.section>

      {/* About Us Carousel Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-12 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Our Story in Pictures
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Take a visual journey through our company culture, values, and the passion that drives us every day
            </p>
          </motion.div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              interval={5000}
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
              {aboutImages.map((image, index) => (
                <div key={index} className="relative h-64 sm:h-80 md:h-96 lg:h-[450px]">
                  <img 
                    src={image.src} 
                    alt={image.title} 
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 lg:p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-white text-left max-w-2xl"
                    >
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 drop-shadow-lg">
                        {image.title}
                      </h3>
                      <p className="text-base sm:text-lg lg:text-xl opacity-90 drop-shadow-lg">
                        {image.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                At MyJamii Stores, we believe shopping should be more than just a transaction. 
                It should be an experience that brings joy, convenience, and value to every customer.
              </p>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Founded with the vision of creating a marketplace that truly serves communities, 
                we've grown from a small startup to a global platform that connects millions of 
                buyers and sellers worldwide.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <FontAwesomeIcon icon={faRocket} className="text-blue-600 text-xl" />
                </div>
                <span className="text-lg font-semibold text-gray-800">Innovation-Driven Excellence</span>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop" 
                  alt="Our Mission" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-semibold">Empowering Communities</p>
                  <p className="text-sm opacity-90">One purchase at a time</p>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-pulse delay-300" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the way we serve our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full shadow-lg mb-6">
                  <FontAwesomeIcon icon={value.icon} className={`text-2xl ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto">
              Trusted by customers worldwide, we're proud of the community we've built
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <FontAwesomeIcon icon={stat.icon} className="text-2xl" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold mb-2 text-blue-400">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate leaders driving innovation and excellence in everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faComments} className="text-white text-sm" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 italic">"{member.quote}"</p>
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
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Experience the difference of shopping with a company that truly cares about its customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>Start Shopping</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faHandshake} />
              <span>Contact Us</span>
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;