import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar component
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import About from './components/About'
import Home from './components/Home';

const App = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showSignup, setShowSignup] = useState(false);

    // Handle user login
    const handleLogin = (userData) => {
        setUser(userData);
    };

    // Handle user signup
    const handleSignup = (userData) => {
        setUser(userData);
        setShowSignup(false); // Switch back to login after signup
    };

    // Add product to cart
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // If the product exists in the cart, increment the quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Otherwise, add the product with quantity 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Remove product from cart
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === productId);

            if (existingItem.quantity === 1) {
                // If quantity is 1, remove the product from the cart
                return prevItems.filter(item => item.id !== productId);
            } else {
                // Otherwise, decrease the quantity
                return prevItems.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
        });
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/"
                    element={
                        user ? (
                            <ProductList addToCart={addToCart} />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                {/* Product listing route */}
                <Route
                    path="/products"
                    element={<ProductList addToCart={addToCart} />}
                />
                {/* Signup route */}
                <Route
                    path="/signup"
                    element={<Signup onSignup={handleSignup} />}
                />
                {/* Cart route */}
                <Route
                    path="/cart"
                    element={
                        user ? (
                            <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                {/* About route */}
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

export default App;
