import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';
import { FaShoppingCart, FaHeart, FaEye, FaCheck, FaTimes, FaStar } from 'react-icons/fa';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [addedToCart, setAddedToCart] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); 
            try {
                const url = selectedCategory 
                    ? `https://myjamii-store.onrender.com/products/category/${selectedCategory}` 
                    : 'https://myjamii-store.onrender.com/products';
                
                console.log("Fetching Products from:", url); 
                const response = await axios.get(url);
                setProducts(response.data.products);
                console.log("Products Fetched:", response.data.products); 
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products.');
            } finally {
                setLoading(false); 
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            alert("This product is out of stock!");
            return;
        }

        // Add visual feedback
        setAddedToCart(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedToCart(prev => ({ ...prev, [product.id]: false }));
        }, 2000);

        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                prevItems.push({ ...product, quantity: 1 });
            }
            return [...prevItems];
        });

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
        });

        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + product.price;
        
        // Create a more elegant notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${product.name} added to cart!</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const ProductCard = ({ product }) => {
        const isInWishlist = wishlist.includes(product.id);
        const isAdded = addedToCart[product.id];

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleWishlist(product.id)}
                                className={`p-3 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                                    isInWishlist 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                                }`}
                            >
                                <FaHeart className="w-4 h-4" />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 rounded-full bg-white bg-opacity-90 text-gray-700 hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-colors duration-300"
                            >
                                <FaEye className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3">
                        {product.stock > 0 ? (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                In Stock: {product.stock}
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Wishlist Heart */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                            isInWishlist 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white bg-opacity-70 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                    >
                        <FaHeart className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6">
                    {/* Product Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {product.name}
                    </h3>

                    {/* Product Description */}
                    <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                    </p>

                    {/* Rating (if available) */}
                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="w-4 h-4" />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                            ${product.price}
                        </span>
                        {/* You could add original price with strikethrough here */}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
                        whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
                        onClick={() => product.stock > 0 && handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center space-x-2 ${
                            product.stock > 0
                                ? isAdded
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isAdded ? (
                            <>
                                <FaCheck className="w-4 h-4" />
                                <span>Added to Cart!</span>
                            </>
                        ) : product.stock > 0 ? (
                            <>
                                <FaShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                            </>
                        ) : (
                            <>
                                <FaTimes className="w-4 h-4" />
                                <span>Out of Stock</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        );
    };

    const LoadingSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 sm:h-56 lg:h-64 bg-gray-300"></div>
            <div className="p-4 sm:p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 lg:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        Our Products
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover our curated collection of premium products across various categories
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <CategoryFilter 
                        onCategoryChange={setSelectedCategory} 
                        selectedCategory={selectedCategory} 
                    />
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {[...Array(8)].map((_, index) => (
                            <LoadingSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                            <div className="text-red-600 text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <AnimatePresence mode="wait">
                        {products.length > 0 ? (
                            <motion.div
                                key="products-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-products"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-12"
                            >
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 max-w-md mx-auto">
                                    <div className="text-blue-600 text-4xl mb-4">🔍</div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">No products found</h3>
                                    <p className="text-blue-600 mb-4">
                                        {selectedCategory 
                                            ? `No products found in the "${selectedCategory}" category.`
                                            : "No products available at the moment."
                                        }
                                    </p>
                                    {selectedCategory && (
                                        <button
                                            onClick={() => setSelectedCategory('')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            View All Products
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Product Count */}
                {!loading && !error && products.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12 text-gray-600"
                    >
                        Showing {products.length} product{products.length !== 1 ? 's' : ''}
                        {selectedCategory && ` in "${selectedCategory}"`}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProductList;