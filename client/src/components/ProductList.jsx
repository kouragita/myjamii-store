import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';
import Notification from './Notification';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [notification, setNotification] = useState(''); // State for notification

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory
                    ? `https://myjamii-store.onrender.com/products/category/${selectedCategory}`
                    : 'https://myjamii-store.onrender.com/products';
                const response = await axios.get(url);
                setProducts(response.data.products);
            } catch (error) {
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            alert("This product is out of stock!");
            return;
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                prevItems.push({ ...product, quantity: 1 });
            }

            return [...prevItems];
        });

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
        });

        const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + product.price;

        // Set notification message
        setNotification(`${product.name} added to cart! \nCart total: $${totalAmount.toFixed(2)}`);

        // Auto-hide notification after 3 seconds
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Products</h2>
            <div style={styles.filterContainer}>
                <CategoryFilter onCategoryChange={setSelectedCategory} selectedCategory={selectedCategory} />

                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {loading ? (
                <p style={styles.loadingText}>Loading products...</p>
            ) : error ? (
                <p style={styles.errorText}>{error}</p>
            ) : (
                <div style={styles.productGrid}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            style={styles.productCard}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={product.image_url}
                                alt={product.name}
                                style={styles.productImage}
                            />
                            <h3 style={styles.productName}>{product.name}</h3>
                            <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                            <p style={styles.stockText(product.stock)}>{product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}</p>

                            <div style={styles.buttonContainer}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    style={styles.addToCartButton}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductClick(product);
                                    }}
                                    style={styles.detailsButton}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedProduct && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
                        <img
                            src={selectedProduct.image_url}
                            alt={selectedProduct.name}
                            style={styles.modalImage}
                        />
                        <p>{selectedProduct.description}</p>
                        <p>Price: ${selectedProduct.price.toFixed(2)}</p>
                        <p>Stock: {selectedProduct.stock > 0 ? selectedProduct.stock : 'Out of stock'}</p>

                        {selectedProduct.stock > 0 ? (
                            <button
                                onClick={() => handleAddToCart(selectedProduct)}
                                style={styles.modalAddToCartButton}
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <button disabled style={styles.outOfStockButton}>
                                Out of Stock
                            </button>
                        )}

                        <button onClick={closeModal} style={styles.closeModalButton}>Close</button>
                    </div>
                </div>
            )}

            <Notification message={notification} onClose={() => setNotification('')} />
        </div>
    );
};
const styles = {
    container: {
        textAlign: 'center',
        marginTop: '80px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    filterContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '20px',
    },
    searchInput: {
        marginLeft: '20px', // Add some spacing between the filter and search input
        padding: '10px',
        width: '300px',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    loadingText: {
        color: '#007bff',
    },
    errorText: {
        color: 'red',
    },
    productGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '20px',
    },
    productCard: {
        width: '250px',
        margin: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
    },
    productImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '10px 10px 0 0',
    },
    productName: {
        fontSize: '18px',
        margin: '10px 0',
    },
    productPrice: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
    stockText: (stock) => ({
        fontSize: '14px',
        color: stock > 0 ? '#28a745' : 'red',
        marginTop: '10px',
    }),
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    addToCartButton: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.3s',
    },
    detailsButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.3s',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        width: '400px',
        position: 'relative',
    },
    modalTitle: {
        fontSize: '20px',
    },
    modalImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '10px',
    },
    modalAddToCartButton: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        width: '100%',
        marginTop: '10px',
    },
    outOfStockButton: {
        backgroundColor: 'gray',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'not-allowed',
        border: 'none',
        width: '100%',
        marginTop: '10px',
    },
    closeModalButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'red',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: '5px 10px',
    },
};

export default ProductList;
