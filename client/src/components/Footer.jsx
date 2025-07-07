import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaFacebook, 
    FaTwitter, 
    FaInstagram, 
    FaLinkedin,
    FaApple, 
    FaGooglePlay,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaArrowUp,
    FaHeart
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaFacebook, href: "https://www.facebook.com/", label: "Facebook", color: "hover:text-blue-500" },
        { icon: FaTwitter, href: "https://x.com/i/flow/login", label: "Twitter", color: "hover:text-sky-400" },
        { icon: FaInstagram, href: "https://www.instagram.com/", label: "Instagram", color: "hover:text-pink-500" },
        { icon: FaLinkedin, href: "https://www.linkedin.com/", label: "LinkedIn", color: "hover:text-blue-600" },
    ];

    const quickLinks = [
        { to: "/about", label: "About Us" },
        { to: "/products", label: "Products" },
        { to: "/contact", label: "Contact" },
        { to: "/faq", label: "FAQ" },
    ];

    const legalLinks = [
        { to: "/terms", label: "Terms of Service" },
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/cookies", label: "Cookie Policy" },
        { to: "/returns", label: "Returns & Refunds" },
    ];

    const contactInfo = [
        { icon: FaEnvelope, text: "hello@myjamii.com", href: "mailto:hello@myjamii.com" },
        { icon: FaPhone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
        { icon: FaMapMarkerAlt, text: "123 Business Ave, City, State 12345", href: "#" },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-300 z-10"
            >
                <FaArrowUp className="w-4 h-4" />
            </motion.button>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="py-8 border-b border-gray-700"
                >
                    <div className="text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated</h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Subscribe to our newsletter for the latest products, deals, and updates.
                        </p>
                        <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-400"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Footer Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="py-12 lg:py-16"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        
                        {/* Company Info */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <Link to="/" className="flex items-center space-x-3 mb-6 group">
                                <img 
                                    src="https://cdn.dribbble.com/userupload/10056937/file/original-b185c3532b852114025434d4e2bd14dd.png?resize=1200x900" 
                                    alt="Myjamii Logo" 
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 group-hover:ring-blue-300 transition-all duration-300"
                                />
                                <h2 className="text-2xl font-bold group-hover:text-blue-300 transition-colors duration-300">
                                    Myjamii <span className="text-blue-400">Stores</span>
                                </h2>
                            </Link>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Your premier destination for quality products across multiple categories. 
                                We're committed to providing exceptional shopping experiences.
                            </p>
                            
                            {/* Contact Info */}
                            <div className="space-y-3">
                                {contactInfo.map((contact, index) => (
                                    <motion.a
                                        key={index}
                                        href={contact.href}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
                                    >
                                        <contact.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                                        <span className="text-sm">{contact.text}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-xl font-bold mb-6 text-blue-300">Quick Links</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.to}
                                            className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Legal */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-xl font-bold mb-6 text-blue-300">Legal</h3>
                            <ul className="space-y-3">
                                {legalLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.to}
                                            className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Mobile Apps & Social */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-xl font-bold mb-6 text-blue-300">Get Our App</h3>
                            <div className="space-y-4 mb-8">
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    href="https://apps.apple.com/"
                                    className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group"
                                >
                                    <FaApple className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                    <div>
                                        <div className="text-xs text-gray-400">Download on the</div>
                                        <div className="text-sm font-semibold">App Store</div>
                                    </div>
                                </motion.a>
                                
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    href="https://play.google.com/"
                                    className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group"
                                >
                                    <FaGooglePlay className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                    <div>
                                        <div className="text-xs text-gray-400">Get it on</div>
                                        <div className="text-sm font-semibold">Google Play</div>
                                    </div>
                                </motion.a>
                            </div>

                            {/* Social Media */}
                            <h4 className="text-lg font-semibold mb-4 text-blue-300">Follow Us</h4>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-3 bg-gray-800 rounded-full text-gray-300 ${social.color} transition-all duration-300 shadow-lg hover:shadow-xl`}
                                        title={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="border-t border-gray-700 py-6"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="text-gray-400 text-sm text-center sm:text-left">
                            <p>© {currentYear} Myjamii Stores. All rights reserved.</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <span>Made with</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <FaHeart className="text-red-500 w-4 h-4" />
                            </motion.div>
                            <span>by Myjamii Team</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;