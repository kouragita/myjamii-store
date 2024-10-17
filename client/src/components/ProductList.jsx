import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('http://localhost:5555/products');
            setProducts(response.data.products);
        };

        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:5555/categories'); // Assuming you have this endpoint
            setCategories(response.data.categories);
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.categories.some(category => category.name === selectedCategory))
        : products;

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Products</h2>
            <select onChange={(e) => setSelectedCategory(e.target.value)} style={{ margin: '10px', padding: '10px' }}>
                <option value="">All Categories</option>
                {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                ))}
            </select>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 'auto' }} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => addToCart(product.id)} style={{ padding: '5px 10px' }}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;