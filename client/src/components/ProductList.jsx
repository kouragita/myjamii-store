import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);  // Track cart items locally

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

    // Function to handle adding products to the cart
    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            alert("This product is out of stock!");
            return;
        }

        // Add product to cartItems state and update cart total
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;  // Increment the quantity if the product is already in the cart
            } else {
                prevItems.push({ ...product, quantity: 1 });  // Add new product to the cart with quantity 1
            }

            return [...prevItems];
        });

        // Call the provided addToCart function with the product details
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
        });

        // Calculate the total cart value
        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + product.price;

        alert(`${product.name} added to cart! \nCart total: $${totalAmount.toFixed(2)}`);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Products</h2>

            <CategoryFilter 
                onCategoryChange={setSelectedCategory} 
                selectedCategory={selectedCategory} 
            />

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '20px' }}>
                    {products.length > 0 ? (
                        products.map(product => (
                            <div 
                                key={product.id} 
                                style={{
                                    width: '250px',
                                    margin: '20px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}
                            >
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    style={{ 
                                        width: '100%', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        borderRadius: '10px 10px 0 0' 
                                    }} 
                                />
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{product.name}</h3>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>{product.description}</p>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#337ab7', marginBottom: '20px' }}>
                                        ${product.price}
                                    </p>
                                    <p style={{ fontSize: '14px', color: product.stock > 0 ? '#28a745' : 'red' }}>
                                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {product.stock > 0 ? (
                                        <button 
                                            onClick={() => handleAddToCart(product)} 
                                            style={{
                                                backgroundColor: '#333',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 20px',
                                                fontSize: '16px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#444'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
                                        >
                                            <i style={{ marginRight: '10px' }} className="fa fa-cart-plus"></i>
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <button 
                                            disabled 
                                            style={{
                                                backgroundColor: '#999',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 20px',
                                                fontSize: '16px',
                                                cursor: 'not-allowed',
                                            }}
                                        >
                                            Out of Stock
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found for this category.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;