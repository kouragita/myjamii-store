import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onLogout, user, cartItemCount = 0 }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActivePath = (path) => location.pathname === path;

    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const dropdownVariants = {
        closed: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: { duration: 0.2 }
        },
        open: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-18">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
                        <div className="relative">
                            <img 
                                src="https://cdn.dribbble.com/userupload/10056937/file/original-b185c3532b852114025434d4e2bd14dd.png?resize=1200x900" 
                                alt="Myjamii Logo" 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-blue-400 group-hover:ring-blue-300 transition-all duration-300"
                            />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                            Myjamii <span className="text-blue-400">Stores</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {/* Navigation Links */}
                        <div className="flex space-x-6">
                            {[
                                { path: '/', label: 'Home' },
                                { path: '/products', label: 'Products' },
                                { path: '/about', label: 'About' },
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                                        isActivePath(item.path)
                                            ? 'text-blue-300'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                    {isActivePath(item.path) && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Auth and Cart Section */}
                        <div className="flex items-center space-x-4">
                            {/* Cart Icon */}
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                            >
                                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                {cartItemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </Link>

                            {/* User Section */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                                    >
                                        <FaUser className="w-4 h-4 text-blue-300" />
                                        <span className="text-sm font-medium text-white">{user.username}</span>
                                        <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                variants={dropdownVariants}
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
                                            >
                                                {user.role === 'admin' && (
                                                    <Link
                                                        to="/admin-dashboard"
                                                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        onLogout();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-300"
                                                >
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex space-x-3">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        {/* Mobile Cart */}
                        <Link to="/cart" className="relative p-2 text-gray-300" onClick={closeMenu}>
                            <FaShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={toggleMenu}
                            className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="lg:hidden overflow-hidden bg-gray-800 border-t border-gray-700"
                        >
                            <div className="px-4 py-3 space-y-3">
                                {/* Mobile Navigation Links */}
                                {[
                                    { path: '/', label: 'Home' },
                                    { path: '/products', label: 'Products' },
                                    { path: '/about', label: 'About' },
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMenu}
                                        className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                                            isActivePath(item.path)
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Mobile User Section */}
                                <div className="pt-3 border-t border-gray-700">
                                    {user ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 px-3 py-2 text-gray-300">
                                                <FaUser className="w-4 h-4" />
                                                <span className="text-sm font-medium">{user.username}</span>
                                            </div>
                                            {user.role === 'admin' && (
                                                <Link
                                                    to="/admin-dashboard"
                                                    onClick={closeMenu}
                                                    className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    onLogout();
                                                    closeMenu();
                                                }}
                                                className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-300"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Link
                                                to="/login"
                                                onClick={closeMenu}
                                                className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                onClick={closeMenu}
                                                className="block px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;