import React, { useState } from 'react'; 
import Checkout from './Checkout';

const Cart = ({ cartItems, addToCart, removeFromCart }) => {
    const [isCheckoutVisible, setCheckoutVisible] = useState(false);

    const handleAddToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id); // Use 'id' here
        if (existingItem) {
            // If the item already exists in the cart, increase its quantity
            existingItem.quantity += 1;
        } else {
            // If the item does not exist, add it to the cart with quantity 1
            addToCart({ ...item, quantity: 1 });
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {cartItems.map((item, index) => (
                            <li key={index} style={{ margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                <div>
                                    <strong>{item.name}</strong> - ${item.price}
                                </div>
                                <div>
                                    Quantity: {item.quantity}
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)} // Use item.id here
                                    style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setCheckoutVisible(true)}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        Proceed to Checkout
                    </button>
                    {isCheckoutVisible && (
                        <Checkout cartItems={cartItems} totalAmount={cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} clearCart={() => {}} />
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;