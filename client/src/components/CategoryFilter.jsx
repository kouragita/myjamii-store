import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaFilter, FaTimes, FaSearch } from 'react-icons/fa';

const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    // Mock categories - in real app, these would come from your API
    const categories = [
        { id: '', name: 'All Categories', count: 150, icon: '🏪' },
        { id: 'electronics', name: 'Electronics', count: 45, icon: '📱' },
        { id: 'clothing', name: 'Clothing & Fashion', count: 38, icon: '👕' },
        { id: 'home', name: 'Home & Garden', count: 22, icon: '🏠' },
        { id: 'sports', name: 'Sports & Outdoors', count: 18, icon: '⚽' },
        { id: 'books', name: 'Books & Media', count: 15, icon: '📚' },
        { id: 'automotive', name: 'Automotive', count: 12, icon: '🚗' },
        { id: 'beauty', name: 'Beauty & Health', count: 25, icon: '💄' },
        { id: 'toys', name: 'Toys & Games', count: 20, icon: '🎮' },
        { id: 'food', name: 'Food & Beverages', count: 30, icon: '🍕' },
    ];

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0];

    const handleCategorySelect = (categoryId) => {
        onCategoryChange(categoryId);
        setIsOpen(false);
        setSearchTerm('');
    };

    const clearCategory = (e) => {
        e.stopPropagation();
        onCategoryChange('');
    };

    // Mobile Drawer Component
    const MobileDrawer = () => (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Filter by Category</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <FaTimes className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-2">
                                {filteredCategories.map((category) => (
                                    <motion.button
                                        key={category.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleCategorySelect(category.id)}
                                        className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 flex items-center justify-between ${
                                            selectedCategory === category.id
                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{category.icon}</span>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full ${
                                            selectedCategory === category.id
                                                ? 'bg-blue-200 text-blue-800'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {category.count}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    // Desktop Dropdown Component
    const DesktopDropdown = () => (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full md:w-80 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            >
                <div className="flex items-center space-x-3">
                    <FaFilter className="text-gray-500 w-4 h-4" />
                    <span className="text-gray-700 font-medium">{selectedCategoryData.name}</span>
                    {selectedCategory && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={clearCategory}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                        >
                            <FaTimes className="w-3 h-3 text-gray-500" />
                        </motion.button>
                    )}
                </div>
                <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-96 overflow-hidden"
                    >
                        {/* Search */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="max-h-72 overflow-y-auto">
                            {filteredCategories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    onClick={() => handleCategorySelect(category.id)}
                                    className={`w-full text-left p-3 transition-colors duration-200 flex items-center justify-between ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-50 text-blue-800'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg">{category.icon}</span>
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-200 text-blue-800'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {category.count}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="w-full flex justify-center mb-6">
            {isMobile ? (
                <>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <FaFilter className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-700 font-medium">
                            {selectedCategory ? selectedCategoryData.name : 'Filter Categories'}
                        </span>
                        {selectedCategory && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={clearCategory}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                            >
                                <FaTimes className="w-3 h-3 text-gray-500" />
                            </motion.button>
                        )}
                    </motion.button>
                    <MobileDrawer />
                </>
            ) : (
                <DesktopDropdown />
            )}
        </div>
    );
};

export default CategoryFilter;