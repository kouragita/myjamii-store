import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import About from './components/About';
import Home from './components/Home';

const App = () => {
    const [user, setUser ] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id); // Use 'id' here
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id // Use 'id' here
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }]; // Ensure product has quantity
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => 
            prevItems.filter(item => item.id !== productId)
        );
    };

    const handleLogin = (userData) => {
        setUser (userData);
        navigate('/products');
    };

    const handleLogout = () => {
        setUser (null);
        setCartItems([]);
        navigate('/products');
    };

    const handleSignup = (userData) => {
        setUser (userData);
        navigate('/products');
    };

    return (
        <>
            <Navbar onLogout={handleLogout} user={user} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList addToCart={addToCart} />} />
                <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                <Route path="/cart" element={<Cart userId={user ? user.id : null} cartItems={cartItems} removeFromCart={removeFromCart} />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
        </>
    );
};

export default App;