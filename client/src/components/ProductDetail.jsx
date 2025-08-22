import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEOHead from './SEOHead';
import LoadingSpinner from './LoadingSpinner';
import groqSEOService from '../services/groqSEOService';
import { 
    FaArrowLeft, 
    FaShoppingCart, 
    FaHeart, 
    FaShare, 
    FaStar,
    FaCheck,
    FaTruck,
    FaShieldAlt
} from 'react-icons/fa';

const ProductDetail = ({ addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiDescription, setAiDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            loadAIDescription();
        }
    }, [product]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://myjamii-store.onrender.com/products`);
            const foundProduct = response.data.products.find(p => p.id === parseInt(id));
            
            if (foundProduct) {
                setProduct(foundProduct);
                // Fetch category details
                if (foundProduct.category_id) {
                    const categoryResponse = await axios.get(`https://myjamii-store.onrender.com/categories`);
                    const foundCategory = categoryResponse.data.categories.find(c => c.id === foundProduct.category_id);
                    setCategory(foundCategory);
                }
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const loadAIDescription = async () => {
        try {
            const enhancedDescription = await groqSEOService.generateProductDescription(product);
            if (enhancedDescription && enhancedDescription !== product.description) {
                setAiDescription(enhancedDescription);
            }
        } catch (error) {
            // Silent fallback to original description
        }
    };

    const handleAddToCart = () => {
        if (product && quantity > 0) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: aiDescription || product.description,
                    url: window.location.href,
                });
            } catch (error) {
                // Fallback to clipboard
                navigator.clipboard.writeText(window.location.href);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOHead 
                type="product" 
                product={{
                    ...product,
                    category: category?.name,
                    description: aiDescription || product.description
                }} 
            />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center hover:text-blue-600 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Products
                        </button>
                        {category && (
                            <>
                                <span>/</span>
                                <span>{category.name}</span>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
                                <img
                                    src={product.image_url || '/images/placeholder.jpg'}
                                    alt={groqSEOService.generateAltText(product.name, product)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Share"
                                    >
                                        <FaShare />
                                    </button>
                                </div>
                                
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">(4.8) 124 reviews</span>
                                    </div>
                                </div>

                                <div className="text-3xl font-bold text-blue-600 mb-6">
                                    ${product.price}
                                </div>
                            </div>

                            {/* AI-Enhanced Description */}
                            <div className="prose prose-sm max-w-none">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">About this product</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {aiDescription || product.description}
                                </p>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2">
                                {product.stock > 0 ? (
                                    <>
                                        <FaCheck className="w-4 h-4 text-green-500" />
                                        <span className="text-green-600 font-medium">
                                            In Stock ({product.stock} available)
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                )}
                            </div>

                            {/* Quantity and Add to Cart */}
                            {product.stock > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                        <select
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                                addedToCart
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            <FaShoppingCart className="mr-2" />
                                            {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                                        </button>
                                        
                                        <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <FaHeart className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <FaTruck className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">Free Shipping</div>
                                        <div className="text-sm text-gray-600">On orders over $50</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <FaShieldAlt className="w-5 h-5 text-green-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">Quality Guarantee</div>
                                        <div className="text-sm text-gray-600">30-day return policy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;