// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ProductList = ({ addToCart }) => {
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');

//     // Fetch products and categories on component mount
//     useEffect(() => {
//         const fetchProducts = async () => {
//             const response = await axios.get('http://localhost:5555/products');
//             setProducts(response.data.products);
//         };

//         const fetchCategories = async () => {
//             const response = await axios.get('http://localhost:5555/categories'); // Assuming you have this endpoint
//             setCategories(response.data.categories);
//         };

//         fetchProducts();
//         fetchCategories();
//     }, []);

//     // Filter products by selected category
//     const filteredProducts = selectedCategory
//         ? products.filter(product => product.categories.some(category => category.name === selectedCategory))
//         : products;

//     return (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//             <h2>Products</h2>
            
//             {/* Category Filter Dropdown */}
//             <select onChange={(e) => setSelectedCategory(e.target.value)} style={{ margin: '10px', padding: '10px' }}>
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                     <option key={category.id} value={category.name}>{category.name}</option>
//                 ))}
//             </select>

//             {/* Display Filtered Products */}
//             <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
//                 {filteredProducts.map(product => (
//                     <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
//                         <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 'auto' }} />
//                         <h3>{product.name}</h3>
//                         <p>{product.description}</p>
//                         <p>Price: ${product.price}</p>
//                         {/* Add to Cart button with full product details passed */}
//                         <button 
//                             onClick={() => addToCart({ 
//                                 id: product.id, 
//                                 name: product.name, 
//                                 price: product.price, 
//                                 image_url: product.image_url 
//                             })} 
//                             style={{ padding: '5px 10px' }}
//                         >
//                             Add to Cart
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductList;

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