import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1>Welcome to MyJamii Stores</h1>
      <p>Discover amazing products at unbeatable prices. Shop now and enjoy free shipping on orders over $50!</p>
      <div className="button-container">
        <button onClick={() => navigate('/products')}>Shop Now</button>
        <button onClick={() => navigate('/about')}>Learn More</button>
      </div>
    </div>
  );
}

export default HomePage;