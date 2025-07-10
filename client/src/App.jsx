import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import About from './components/About';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import NotificationProvider from './components/NotificationProvider';
import PWAInstall from './components/PWAInstall';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Load data from localStorage on component mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('myjamii_user');
            const storedCart = localStorage.getItem('myjamii_cart');
            
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('myjamii_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [cartItems]);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('myjamii_user', JSON.stringify(user));
            } else {
                localStorage.removeItem('myjamii_user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    }, [user]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => 
            prevItems.filter(item => item.id !== productId)
        );
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const handleLogin = (userData) => {
        setUser(userData);
        navigate('/');
    };

    const handleLogout = () => {
        setUser(null);
        setCartItems([]);
        localStorage.removeItem('myjamii_user');
        localStorage.removeItem('myjamii_cart');
        navigate('/');
    };

    const handleSignup = (userData) => {
        setUser(userData);
        navigate('/');
    };

    const isLoggedIn = !!user;
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Protected Route Component
    const ProtectedRoute = ({ children, requiredRole }) => {
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        
        if (requiredRole && user.role !== requiredRole) {
            return <Navigate to="/" replace />;
        }
        
        return children;
    };

    return (
        <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <ScrollToTop />
                <Navbar 
                    onLogout={handleLogout} 
                    user={user} 
                    cartItemCount={cartItemCount} 
                />
                
                {/* Main content area with proper spacing for fixed navbar */}
                <main className="flex-1 pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        
                        <Route 
                            path="/products" 
                            element={<ProductList addToCart={addToCart} />} 
                        />
                        
                        <Route 
                            path="/signup" 
                            element={
                                isLoggedIn ? 
                                <Navigate to="/" replace /> : 
                                <Signup onSignup={handleSignup} />
                            } 
                        />
                        
                        <Route 
                            path="/login" 
                            element={
                                isLoggedIn ? 
                                <Navigate to="/" replace /> : 
                                <Login onLogin={handleLogin} />
                            } 
                        />
                        
                        <Route 
                            path="/cart" 
                            element={
                                <Cart 
                                    cartItems={cartItems} 
                                    removeFromCart={removeFromCart} 
                                    updateCartQuantity={updateCartQuantity}
                                    clearCart={clearCart} 
                                    isLoggedIn={isLoggedIn} 
                                    user={user}
                                />
                            } 
                        />

                        <Route 
                            path="/checkout" 
                            element={
                                <Checkout 
                                    cartItems={cartItems}
                                    clearCart={clearCart}
                                    user={user}
                                />
                            } 
                        />
                        
                        <Route path="/about" element={<About />} />
                        
                        {/* Protected Admin Route */}
                        <Route 
                            path="/admin-dashboard" 
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminDashboard user={user} />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* 404 Not Found Route */}
                        <Route 
                            path="*" 
                            element={
                                <div className="min-h-screen flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                            Page Not Found
                                        </h1>
                                        <p className="text-gray-600 mb-6">
                                            The page you're looking for doesn't exist.
                                        </p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            Go Home
                                        </button>
                                    </div>
                                </div>
                            } 
                        />
                    </Routes>
                </main>
                
                <Footer />

                {/* PWA Install Prompt */}
                <PWAInstall />
            </div>
        </NotificationProvider>
    );
};

export default App;