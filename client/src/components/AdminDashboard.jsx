import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [product, setProduct] = useState({ id: '', name: '', price: '', description: '', stock: '', image_url: '', category_id: '' });
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [newCategory, setNewCategory] = useState({ name: '', description: '' }); // State for new category

    useEffect(() => {
        fetchProducts();
        fetchCategories(); // Fetch categories on component mount
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:5555/products');
        setProducts(response.data.products);
    };

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:5555/categories');
        setCategories(response.data.categories);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (product.id) {
            // Update existing product
            await axios.put(`http://localhost:5555/products/${product.id}`, product);
        } else {
            // Create new product
            await axios.post('http://localhost:5555/products', product);
        }
        setProduct({ id: '', name: '', price: '', description: '', stock: '', image_url: '', category_id: '' }); // Reset form
        fetchProducts(); // Refresh product list
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            // Optimistically update the categories state
            const newCategoryData = { name: newCategory.name, description: newCategory.description };
            setCategories([...categories, newCategoryData]); // Add new category to the state

            // Send request to create the category
            const response = await axios.post('http://localhost:5555/categories', newCategory);
            // Optionally, you can update the new category with the ID returned from the server
            const createdCategory = response.data.category;
            setCategories(categories.map(cat => cat.name === newCategory.name ? createdCategory : cat)); // Update with ID

            // Reset category form
            setNewCategory({ name: '', description: '' });
        } catch (error) {
            console.error('Error creating category:', error);
            // Optionally, you can handle errors and revert the optimistic update
            fetchCategories(); // Re-fetch categories if there's an error
        }
    };

    const handleEdit = (p) => {
        setProduct(p);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5555/products/${id}`);
        fetchProducts(); // Refresh product list
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333' }}>Admin Dashboard</h1>
            <h2 style={{ color: '#333' }}>Manage Products</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Product Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                    style={{ marginRight: '10px', padding: '5 px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Product Description"
                    value={product.description}
                    onChange={handleChange}
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={product.stock}
                    onChange={handleChange}
                    required
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={product.image_url}
                    onChange={handleChange}
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <select
                    name="category_id"
                    value={product.category_id}
                    onChange={handleChange}
                    required
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {product.id ? 'Update Product' : 'Add Product'}
                </button>
            </form>

            <h2 style={{ color: '#333' }}>Create New Category</h2>
            <form onSubmit={handleCategorySubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={handleCategoryChange}
                    required
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <textarea
                    name="description"
                    placeholder="Category Description"
                    value={newCategory.description}
                    onChange={handleCategoryChange}
                    style={{ marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Create Category
                </button>
            </form>

            <h3 style={{ color: '#333' }}>Product List</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {products.map((p) => (
                    <li key={p.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {p.name} - ${p.price} (Stock: {p.stock})
                        <div>
                            <button onClick={() => handleEdit(p)} style={{ marginLeft: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none ', borderRadius: '4px', cursor: 'pointer' }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '5px', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;