import { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // For handling edits
    const [imageUrl, setImageUrl] = useState(''); // For storing uploaded image URL

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://myjamii-store.onrender.com/products');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://myjamii-store.onrender.com/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setImageUrl(product.image_url); // Set image URL for editing
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await axios.delete(`https://myjamii-store.onrender.com/products/${id}`);
                if (response.status === 204) {
                    console.log('Product deleted successfully');
                    fetchProducts(); // Refresh products after deletion
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSubmitProduct = async (values, { resetForm }) => {
        const productData = {
            name: values.name,
            price: parseFloat(values.price),
            description: values.description,
            stock: parseInt(values.stock),
            image_url: imageUrl || values.image_url, // Use uploaded image URL or provided URL
            category_id: parseInt(values.category_id),
        };

        try {
            if (editingProduct) {
                // Update existing product
                await axios.put(`https://myjamii-store.onrender.com/products/${editingProduct.id}`, productData);
                console.log('Product updated successfully');
            } else {
                // Create new product
                await axios.post('https://myjamii-store.onrender.com/products', productData);
                console.log('Product created successfully');
            }
            resetForm();
            setEditingProduct(null);
            setImageUrl(''); // Reset image URL
            fetchProducts(); // Refresh product list after submission
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const handleSubmitCategory = async (values, { resetForm }) => {
        const newCategoryData = {
            name: values.name,
            description: values.description,
        };

        try {
            const response = await axios.post('https://myjamii-store.onrender.com/categories', newCategoryData);
            setCategories([...categories, response.data.category]);
            resetForm(); // Reset form after submission
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'icn4cljy'); // Use the unsigned preset

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dfxnefnjj/image/upload', formData);
            setImageUrl(response.data.secure_url); // Set the image URL
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', marginTop: '100px' }}>
            <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center', width: '100%' }}>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#333' }}>Manage Products</h2>
                    <Formik
                        initialValues={{
                            name: editingProduct?.name || '',
                            price: editingProduct?.price || '',
                            description: editingProduct?.description || '',
                            stock: editingProduct?.stock || '',
                            image_url: editingProduct?.image_url || '',
                            category_id: editingProduct?.category_id || '',
                        }}
                        enableReinitialize
                        onSubmit={handleSubmitProduct}
                    >
                        {({ handleChange, values }) => (
                            <Form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Product Name"
                                    required
                                    style={inputStyle}
                                    value={values.name}
                                    onChange={handleChange}
                                />
                                <Field
                                    type="number"
                                    name="price"
                                    placeholder="Product Price"
                                    required
                                    style={inputStyle}
                                    value={values.price}
                                    onChange={handleChange}
                                />
                                <Field
                                    type="text"
                                    name="description"
                                    placeholder="Product Description"
                                    style={inputStyle}
                                    value={values.description}
                                    onChange={handleChange}
                                />
                                <Field
                                    type="number"
                                    name="stock"
                                    placeholder="Stock Quantity"
                                    required
                                    style={inputStyle}
                                    value={values.stock}
                                    onChange={handleChange}
                                />
                                <Field
                                    type="text"
                                    name="image_url"
                                    placeholder="Image URL (optional)"
                                    style={inputStyle}
                                    value={values.image_url}
                                    onChange={handleChange}
                                />
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    style={inputStyle}
                                />
                                <Field
                                    as="select"
                                    name="category_id"
                                    required
                                    style={inputStyle}
                                    value={values.category_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                <button type="submit" style={buttonStyle}>
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#333' }}>Create New Category</h2>
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                        }}
                        onSubmit={handleSubmitCategory}
                    >
                        {({ handleChange }) => (
                            <Form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Category Name"
                                    required
                                    style={inputStyle}
                                    onChange={handleChange}
                                />
                                <Field
                                    as="textarea"
                                    name="description"
                                    placeholder="Category Description"
                                    style={inputStyle}
                                    onChange={handleChange}
                                />
                                <button type="submit" style={buttonStyle}>
                                    Create Category
                                </button>
                            </Form>
                        )}
                    </Formik>
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
                        <tr key={p.id} style={trStyle}>
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

// Styles for form inputs, buttons, and table
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
    width: '150px',
};

const editButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
};

const deleteButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

// Styles for table
const thStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '15px',
    border: '1px solid #dee2e6',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '1.1em',
};

const tdStyle = {
    padding: '15px',
    border: '1px solid #dee2e6',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
};

const trStyle = {
    '&:hover': {
        backgroundColor: '#f1f1f1',
    },
};

export default AdminDashboard;
