import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Checkout from './Checkout';

const Cart = ({ cartItems, removeFromCart, clearCart, isLoggedIn }) => { // Added clearCart prop
    const [isCheckoutVisible, setCheckoutVisible] = useState(false);
    const navigate = useNavigate(); // Create navigate instance

    const handleProceedToCheckout = () => {
        if (isLoggedIn) {
            setCheckoutVisible(true);
        } else {
            alert("Please log in to proceed to checkout.");
            navigate('/login'); // Redirect to the login page
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p style={styles.emptyMessage}>Your cart is empty</p>
            ) : (
                <>
                    <ul style={styles.itemList}>
                        {cartItems.map((item, index) => (
                            <li key={index} style={styles.item}>
                                <div style={styles.itemDetails}>
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        style={styles.productImage}
                                    />
                                    <div style={styles.productInfo}>
                                        <strong style={styles.productName}>{item.name}</strong>
                                        <p style={styles.productDescription}>{item.description}</p>
                                        <div style={styles.priceQuantity}>
                                            <span style={styles.price}>${item.price}</span>
                                            <span style={styles.quantity}>Quantity: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={styles.removeButton}>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div style={styles.buttonContainer}>
                        <button
                            onClick={handleProceedToCheckout}
                            style={styles.checkoutButton}
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={clearCart} // Call clearCart function from props
                            style={styles.clearCartButton}
                        >
                            Clear Cart
                        </button>
                    </div>

                    {isCheckoutVisible && (
                        <Checkout
                            cartItems={cartItems}
                            totalAmount={cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
                            clearCart={clearCart}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'left',
        margin: '50px auto 20px',
        maxWidth: '800px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
    },
    itemList: {
        listStyleType: 'none',
        padding: 0,
        width: '100%',
    },
    item: {
        margin: '15px 0',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '10px',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        padding: '15px',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        backgroundColor: '#f9f9f9',
    },
    itemDetails: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
    },
    productImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '5px',
        marginRight: '15px',
    },
    productInfo: {
        flex: 1,
        marginRight: '10px',
    },
    productName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
    },
    productDescription: {
        fontSize: '14px',
        color: '#666',
    },
    priceQuantity: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5px',
    },
    price: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000',
    },
    quantity: {
        fontSize: '14px',
        color: '#333',
    },
    removeButton: {
        marginLeft: '15px',
        padding: '8px 12px',
        backgroundColor: '#ff4d4d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    removeButtonHover: {
        backgroundColor: '#ff1a1a',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
    },
    checkoutButton: {
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '48%',
        transition: 'background-color 0.3s',
    },
    clearCartButton: {
        padding: '10px 20px',
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '48%',
        transition: 'background-color 0.3s',
    },
};

export default Cart;
