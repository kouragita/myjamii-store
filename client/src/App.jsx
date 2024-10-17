import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar component
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

const App = () => {
    const [user, setUser ] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showSignup, setShowSignup] = useState(false);

    const handleLogin = (userData) => {
        setUser (userData);
    };

    const handleSignup = (userData) => {
        setUser (userData);
        setShowSignup(false); // Switch back to login after signup
    };

    const addToCart = (productId) => {
        setCartItems((prevItems) => [...prevItems, productId]);
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item !== productId));
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={user ? <ProductList addToCart={addToCart} /> : <Login onLogin={handleLogin} />} />
                <Route path="/products" element={<ProductList addToCart={addToCart} />} />
                <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                <Route path="/cart" element={user ? <Cart cartItems={cartItems} removeFromCart={removeFromCart} /> : <Login onLogin={handleLogin} />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;