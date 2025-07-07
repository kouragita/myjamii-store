// LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4`}
                />
                <p className="text-gray-600 font-medium">{message}</p>
            </div>
        </div>
    );
};

// ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-colors duration-300"
                >
                    <FaArrowUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// NotificationProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes } from 'react-icons/fa';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type };
        
        setNotifications(prev => [...prev, notification]);
        
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
        
        return id;
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const notificationIcons = {
        success: FaCheck,
        error: FaExclamationTriangle,
        warning: FaExclamationTriangle,
        info: FaInfo
    };

    const notificationColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            
            {/* Notification Container */}
            <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
                <AnimatePresence>
                    {notifications.map(notification => {
                        const Icon = notificationIcons[notification.type];
                        const colorClass = notificationColors[notification.type];
                        
                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                                className={`${colorClass} text-white p-4 rounded-lg shadow-lg flex items-center space-x-3`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="flex-1 text-sm font-medium">{notification.message}</span>
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="text-white hover:text-gray-200 transition-colors duration-200"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

// ImageWithFallback.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ImageWithFallback = ({ 
    src, 
    fallbackSrc = '/api/placeholder/300/200', 
    alt, 
    className = '',
    ...props 
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
            )}
            
            <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                src={imgSrc}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`w-full h-full object-cover ${isLoading ? 'invisible' : 'visible'}`}
                {...props}
            />
            
            {hasError && imgSrc === fallbackSrc && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="text-sm">Image not available</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ 
    onSearch, 
    placeholder = 'Search products...', 
    suggestions = [],
    className = '' 
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSuggestions(filtered.slice(0, 5));
            setIsOpen(filtered.length > 0);
        } else {
            setIsOpen(false);
            setFilteredSuggestions([]);
        }
    }, [query, suggestions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setIsOpen(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setIsOpen(false);
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
        onSearch('');
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query && setIsOpen(true)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                    {query && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <FaTimes className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {isOpen && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto"
                    >
                        {filteredSuggestions.map((suggestion, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                            >
                                <FaSearch className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-700">{suggestion}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Export all components
export { LoadingSpinner, ScrollToTop, NotificationProvider, ImageWithFallback, SearchBar };