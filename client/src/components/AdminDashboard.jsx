import { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaSearch, 
    FaFilter, 
    FaImage, 
    FaCloudUploadAlt,
    FaBox,
    FaTags,
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaExclamationTriangle,
    FaEye,
    FaCheck,
    FaTimes,
    FaSpinner,
    FaExclamationCircle
} from 'react-icons/fa';

// Product validation schema
const productValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Product name must be at least 3 characters')
        .max(100, 'Product name must be less than 100 characters')
        .required('Product name is required'),
    price: Yup.number()
        .min(0.01, 'Price must be greater than 0')
        .max(999999, 'Price is too high')
        .required('Price is required'),
    description: Yup.string()
        .max(500, 'Description must be less than 500 characters'),
    stock: Yup.number()
        .min(0, 'Stock cannot be negative')
        .integer('Stock must be a whole number')
        .required('Stock quantity is required'),
    image_url: Yup.string()
        .url('Please enter a valid URL'),
    category_id: Yup.number()
        .required('Please select a category')
});

// Category validation schema
const categoryValidationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must be less than 50 characters')
        .required('Category name is required'),
    description: Yup.string()
        .max(200, 'Description must be less than 200 characters')
});

// Analytics Tab Component
const AnalyticsTab = ({ products, categories }) => {
    // Calculate analytics
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockProducts = products.filter(p => p.stock < 10);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    const averagePrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
    
    // Category analytics
    const categoryStats = categories.map(category => {
        const categoryProducts = products.filter(p => p.category_id === category.id);
        const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
        const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
        
        return {
            ...category,
            productCount: categoryProducts.length,
            totalStock,
            totalValue,
            averagePrice: categoryProducts.length > 0 ? totalValue / totalStock : 0
        };
    });

    // Top products by value
    const topProductsByValue = products
        .map(p => ({ ...p, totalValue: p.price * p.stock }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

    const analyticsCards = [
        {
            title: 'Total Inventory Value',
            value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: FaChartBar,
            color: 'bg-green-500',
            change: '+5.2%',
            trend: 'up'
        },
        {
            title: 'Average Product Price',
            value: `$${averagePrice.toFixed(2)}`,
            icon: FaChartBar,
            color: 'bg-blue-500',
            change: '+2.1%',
            trend: 'up'
        },
        {
            title: 'Low Stock Alerts',
            value: lowStockProducts.length,
            icon: FaExclamationTriangle,
            color: 'bg-yellow-500',
            change: lowStockProducts.length > 0 ? 'Needs attention' : 'All good',
            trend: lowStockProducts.length > 0 ? 'down' : 'up'
        },
        {
            title: 'Out of Stock',
            value: outOfStockProducts.length,
            icon: FaArrowDown,
            color: 'bg-red-500',
            change: outOfStockProducts.length > 0 ? 'Restock needed' : 'In stock',
            trend: 'down'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {card.value}
                                </p>
                                <div className="flex items-center mt-2">
                                    {card.trend === 'up' ? (
                                        <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${
                                        card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {card.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`${card.color} rounded-lg p-3`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products by Value */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FaChartBar className="w-5 h-5 mr-2 text-blue-500" />
                            Top Products by Value
                        </h3>
                    </div>
                    <div className="p-6">
                        {topProductsByValue.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No products available</p>
                        ) : (
                            <div className="space-y-4">
                                {topProductsByValue.map((product, index) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {product.stock} units × ${product.price}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${product.totalValue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FaTags className="w-5 h-5 mr-2 text-green-500" />
                            Category Performance
                        </h3>
                    </div>
                    <div className="p-6">
                        {categoryStats.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No categories available</p>
                        ) : (
                            <div className="space-y-4">
                                {categoryStats.map((category) => (
                                    <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                                            <span className="text-sm text-gray-500">
                                                {category.productCount} products
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Total Stock</p>
                                                <p className="font-semibold">{category.totalStock}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Total Value</p>
                                                <p className="font-semibold">${category.totalValue.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ 
                                                        width: `${Math.min((category.totalValue / totalValue) * 100, 100)}%` 
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {totalValue > 0 ? ((category.totalValue / totalValue) * 100).toFixed(1) : 0}% of total value
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FaExclamationTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                            Inventory Alerts
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {outOfStockProducts.length > 0 && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="font-medium text-red-800 mb-2">
                                        Out of Stock ({outOfStockProducts.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {outOfStockProducts.slice(0, 5).map(product => (
                                            <div key={product.id} className="text-sm text-red-700">
                                                • {product.name}
                                            </div>
                                        ))}
                                        {outOfStockProducts.length > 5 && (
                                            <div className="text-sm text-red-600 font-medium">
                                                +{outOfStockProducts.length - 5} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {lowStockProducts.length > 0 && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h4 className="font-medium text-yellow-800 mb-2">
                                        Low Stock ({lowStockProducts.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {lowStockProducts.slice(0, 5).map(product => (
                                            <div key={product.id} className="text-sm text-yellow-700 flex justify-between">
                                                <span>• {product.name}</span>
                                                <span className="font-medium">{product.stock} left</span>
                                            </div>
                                        ))}
                                        {lowStockProducts.length > 5 && (
                                            <div className="text-sm text-yellow-600 font-medium">
                                                +{lowStockProducts.length - 5} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://myjamii-store.onrender.com/products');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            showNotification('Failed to fetch products', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://myjamii-store.onrender.com/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            showNotification('Failed to fetch categories', 'error');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setImageUrl(product.image_url);
        setActiveTab('products');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await axios.delete(`https://myjamii-store.onrender.com/products/${id}`);
                if (response.status === 204) {
                    showNotification('Product deleted successfully');
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Failed to delete product', 'error');
            }
        }
    };

    const handleSubmitProduct = async (values, { resetForm, setSubmitting }) => {
        const productData = {
            name: values.name,
            price: parseFloat(values.price),
            description: values.description,
            stock: parseInt(values.stock),
            image_url: imageUrl || values.image_url,
            category_id: parseInt(values.category_id),
        };

        try {
            if (editingProduct) {
                await axios.put(`https://myjamii-store.onrender.com/products/${editingProduct.id}`, productData);
                showNotification('Product updated successfully');
            } else {
                await axios.post('https://myjamii-store.onrender.com/products', productData);
                showNotification('Product created successfully');
            }
            resetForm();
            setEditingProduct(null);
            setImageUrl('');
            fetchProducts();
        } catch (error) {
            console.error('Error submitting product:', error);
            showNotification('Failed to save product', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitCategory = async (values, { resetForm, setSubmitting }) => {
        const newCategoryData = {
            name: values.name,
            description: values.description,
        };

        try {
            const response = await axios.post('https://myjamii-store.onrender.com/categories', newCategoryData);
            setCategories([...categories, response.data.category]);
            resetForm();
            showNotification('Category created successfully');
        } catch (error) {
            console.error('Error creating category:', error);
            showNotification('Failed to create category', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'icn4cljy');

        try {
            setIsUploading(true);
            const response = await axios.post('https://api.cloudinary.com/v1_1/dfxnefnjj/image/upload', formData);
            setImageUrl(response.data.secure_url);
            showNotification('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('Failed to upload image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category_id === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const stats = [
        { label: 'Total Products', value: products.length, icon: FaBox, color: 'bg-blue-500' },
        { label: 'Categories', value: categories.length, icon: FaTags, color: 'bg-green-500' },
        { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, icon: FaChartBar, color: 'bg-yellow-500' },
        { label: 'Total Value', value: `$${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}`, icon: FaChartBar, color: 'bg-purple-500' }
    ];

    // Error message component
    const ErrorMessage = ({ error, touched }) => {
        if (!error || !touched) return null;
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-500 text-sm mt-1"
            >
                <FaExclamationCircle className="w-3 h-3 mr-1" />
                {error}
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
                            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                        } text-white`}
                    >
                        <div className="flex items-center space-x-2">
                            {notification.type === 'error' ? <FaTimes /> : <FaCheck />}
                            <span>{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your products and categories</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                        >
                            <div className="flex items-center">
                                <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'products', label: 'Products', icon: FaBox },
                                { id: 'categories', label: 'Categories', icon: FaTags },
                                { id: 'analytics', label: 'Analytics', icon: FaChartBar }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Product Form */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-24">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <FaPlus className="w-5 h-5 mr-2 text-blue-500" />
                                        {editingProduct ? 'Edit Product' : 'Add Product'}
                                    </h2>
                                    
                                    <Formik
                                        initialValues={{
                                            name: editingProduct?.name || '',
                                            price: editingProduct?.price || '',
                                            description: editingProduct?.description || '',
                                            stock: editingProduct?.stock || '',
                                            image_url: editingProduct?.image_url || '',
                                            category_id: editingProduct?.category_id || '',
                                        }}
                                        validationSchema={productValidationSchema}
                                        enableReinitialize
                                        onSubmit={handleSubmitProduct}
                                    >
                                        {({ isSubmitting, values, handleChange, errors, touched }) => (
                                            <Form className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Product Name *
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        className={`input-field ${errors.name && touched.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                        placeholder="Enter product name"
                                                    />
                                                    <ErrorMessage error={errors.name} touched={touched.name} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Price ($) *
                                                    </label>
                                                    <Field
                                                        type="number"
                                                        name="price"
                                                        step="0.01"
                                                        className={`input-field ${errors.price && touched.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                        placeholder="0.00"
                                                    />
                                                    <ErrorMessage error={errors.price} touched={touched.price} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Description
                                                    </label>
                                                    <Field
                                                        as="textarea"
                                                        name="description"
                                                        rows={3}
                                                        className={`input-field resize-none ${errors.description && touched.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                        placeholder="Product description (optional)"
                                                    />
                                                    <ErrorMessage error={errors.description} touched={touched.description} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Stock Quantity *
                                                    </label>
                                                    <Field
                                                        type="number"
                                                        name="stock"
                                                        className={`input-field ${errors.stock && touched.stock ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                        placeholder="0"
                                                    />
                                                    <ErrorMessage error={errors.stock} touched={touched.stock} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category *
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        name="category_id"
                                                        className={`input-field ${errors.category_id && touched.category_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage error={errors.category_id} touched={touched.category_id} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Image URL (optional)
                                                    </label>
                                                    <Field
                                                        type="url"
                                                        name="image_url"
                                                        className={`input-field ${errors.image_url && touched.image_url ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                    <ErrorMessage error={errors.image_url} touched={touched.image_url} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Upload Image
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                                        <input
                                                            type="file"
                                                            onChange={handleImageUpload}
                                                            accept="image/*"
                                                            className="hidden"
                                                            id="image-upload"
                                                        />
                                                        <label
                                                            htmlFor="image-upload"
                                                            className="cursor-pointer flex flex-col items-center"
                                                        >
                                                            {isUploading ? (
                                                                <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                                                            ) : (
                                                                <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-2" />
                                                            )}
                                                            <span className="text-sm text-gray-600">
                                                                {isUploading ? 'Uploading...' : 'Click to upload image'}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {(imageUrl || values.image_url) && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Image Preview
                                                        </label>
                                                        <img
                                                            src={imageUrl || values.image_url}
                                                            alt="Preview"
                                                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex space-x-3 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? (
                                                            <FaSpinner className="animate-spin mr-2" />
                                                        ) : editingProduct ? (
                                                            <FaEdit className="mr-2" />
                                                        ) : (
                                                            <FaPlus className="mr-2" />
                                                        )}
                                                        {editingProduct ? 'Update' : 'Add'} Product
                                                    </button>
                                                    {editingProduct && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingProduct(null);
                                                                setImageUrl('');
                                                            }}
                                                            className="btn-secondary"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>

                            {/* Products List */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    {/* Search and Filter */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 relative">
                                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                                <input
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-12 input-field"
                                                />
                                            </div>
                                            <div className="sm:w-48 relative">
                                                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="pl-12 input-field"
                                                >
                                                    <option value="">All Categories</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products Table */}
                                    <div className="overflow-x-auto">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
                                            </div>
                                        ) : filteredProducts.length === 0 ? (
                                            <div className="text-center py-12">
                                                <FaBox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No products found</p>
                                            </div>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Product
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Price
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Stock
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Category
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredProducts.map((product) => (
                                                        <motion.tr
                                                            key={product.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-12 w-12 flex-shrink-0">
                                                                        {product.image_url ? (
                                                                            <img
                                                                                src={product.image_url}
                                                                                alt={product.name}
                                                                                className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                                <FaImage className="text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                                            {product.name}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                                            {product.description}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    ${product.price}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    product.stock < 10
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : product.stock < 50
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {product.stock}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => handleEdit(product)}
                                                                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <FaEdit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(product.id)}
                                                                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <FaTrash className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Category Form */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <FaTags className="w-5 h-5 mr-2 text-green-500" />
                                Create New Category
                            </h2>
                            
                            <Formik
                                initialValues={{ name: '', description: '' }}
                                validationSchema={categoryValidationSchema}
                                onSubmit={handleSubmitCategory}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category Name *
                                            </label>
                                            <Field
                                                type="text"
                                                name="name"
                                                className={`input-field ${errors.name && touched.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                placeholder="Enter category name"
                                            />
                                            <ErrorMessage error={errors.name} touched={touched.name} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                rows={4}
                                                className={`input-field resize-none ${errors.description && touched.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                placeholder="Category description (optional)"
                                            />
                                            <ErrorMessage error={errors.description} touched={touched.description} />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <FaSpinner className="animate-spin mr-2" />
                                            ) : (
                                                <FaPlus className="mr-2" />
                                            )}
                                            Create Category
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* Categories List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                            </div>
                            <div className="p-6">
                                {categories.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FaTags className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No categories created yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {categories.map((category) => (
                                            <motion.div
                                                key={category.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                            >
                                                <h4 className="font-medium text-gray-900">{category.name}</h4>
                                                {category.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                                )}
                                                <div className="mt-2 text-xs text-gray-500">
                                                    {products.filter(p => p.category_id === category.id).length} products
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <AnalyticsTab products={products} categories={categories} />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;