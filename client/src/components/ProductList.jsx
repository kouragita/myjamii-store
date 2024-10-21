import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button 
                                        onClick={() => addToCart({ 
                                            id: product.id, 
                                            name: product.name, 
                                            price: product.price, 
                                            image_url: product.image_url 
                                        })} 
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