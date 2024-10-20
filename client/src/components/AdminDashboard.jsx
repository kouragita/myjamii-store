import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [product, setProduct] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        stock: '',
        image_url: '',
        category_id: ''
    });
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('https://myjamii-store.onrender.com/products');
        setProducts(response.data.products);
    };

    const fetchCategories = async () => {
        const response = await axios.get('https://myjamii-store.onrender.com/categories');
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
            await axios.put(`https://myjamii-store.onrender.com/products/${product.id}`, product);
        } else {
            await axios.post('https://myjamii-store.onrender.com/products', product);
        }
        setProduct({ id: '', name: '', price: '', description: '', stock: '', image_url: '', category_id: '' });
        fetchProducts();
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const newCategoryData = { name: newCategory.name, description: newCategory.description };
            const response = await axios.post('https://myjamii-store.onrender.com/categories', newCategoryData);
            const createdCategory = response.data.category;

            // Update the categories state
            setCategories([...categories, createdCategory]);

            // Reset the newCategory state to clear input fields
            setNewCategory({ name: '', description: '' });
        } catch (error) {
            console.error('Error creating category:', error);
            fetchCategories();
            
            // Reset the newCategory state even on error
            setNewCategory({ name: '', description: '' });
        }
    };

    const handleEdit = (p) => {
        setProduct(p);
    };

    const handleDelete = async (id) => {
        await axios.delete(`https://myjamii-store.onrender.com/products/${id}`);
        fetchProducts();
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', marginTop: '100px' }}>
            <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center', width: '100%' }}>Admin Dashboard</h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#333' }}>Manage Products</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Product Price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Product Description"
                            value={product.description}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock Quantity"
                            value={product.stock}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            name="image_url"
                            placeholder="Image URL"
                            value={product.image_url}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <select
                            name="category_id"
                            value={product.category_id}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" style={buttonStyle}>
                            {product.id ? 'Update Product' : 'Add Product'}
                        </button>
                    </form>
                </div>

                <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#333' }}>Create New Category</h2>
                    <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChange={handleCategoryChange}
                            required
                            style={inputStyle}
                        />
                        <textarea
                            name="description"
                            placeholder="Category Description"
                            value={newCategory.description}
                            onChange={handleCategoryChange}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>
                            Create Category
                        </button>
                    </form>
                </div>
            </div>

            <h3 style={{ color: '#333' }}>Product List</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td style={tdStyle}>{p.name}</td>
                            <td style={tdStyle}>${p.price}</td>
                            <td style={tdStyle}>{p.stock}</td>
                            <td style={tdStyle}>
                                <button onClick={() => handleEdit(p)} style={editButtonStyle}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(p.id)} style={deleteButtonStyle}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Common styles for inputs and buttons
const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '400px',
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    maxWidth: '150px',
};

const editButtonStyle = {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const deleteButtonStyle = {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
};

const thStyle = {
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'left',
};

const tdStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
};

export default AdminDashboard;
