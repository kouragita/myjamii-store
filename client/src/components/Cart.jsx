import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Checkout from './Checkout';

const Cart = ({ cartItems, removeFromCart, isLoggedIn }) => {
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
            <h2 style={styles.title}>Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <ul style={styles.itemList}>
                        {cartItems.map((item, index) => (
                            <li key={index} style={styles.item}>
                                <div style={styles.itemDetails}>
                                    <strong>{item.name}</strong> - ${item.price}
                                </div>
                                <div>Quantity: {item.quantity}</div>
                                <button 
                                    onClick={() => removeFromCart(item.id)} 
                                    style={styles.removeButton}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleProceedToCheckout}
                        style={styles.checkoutButton}
                    >
                        Proceed to Checkout
                    </button>
                    {isCheckoutVisible && (
                        <Checkout 
                            cartItems={cartItems} 
                            totalAmount={cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} 
                            clearCart={() => {}} 
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
        maxWidth: '600px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
    },
    itemList: {
        listStyleType: 'none',
        padding: 0,
        width: '100%',
    },
    item: {
        margin: '10px 0',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        width: '100%',
    },
    itemDetails: {
        marginBottom: '5px',
    },
    removeButton: {
        marginLeft: '10px',
        padding: '5px 10px',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    checkoutButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        borderRadius: '5px',
    },
};

export default Cart;