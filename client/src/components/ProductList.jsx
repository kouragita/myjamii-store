import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5555/categories');
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch products when the selected category changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/products${selectedCategory ? `/${selectedCategory}` : ''}`);
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Products</h2>
            
            <CategoryFilter 
                onCategoryChange={setSelectedCategory} 
                selectedCategory={selectedCategory} 
            />

            

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 'auto' }} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <button 
                                onClick={() => addToCart({ 
                                    id: product.id, 
                                    name: product.name, 
                                    price: product.price, 
                                    image_url: product.image_url 
                                })} 
                                style={{ padding: '5px 10px' }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No products found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;