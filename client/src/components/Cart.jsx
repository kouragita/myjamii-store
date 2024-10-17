import React from 'react';

const Cart = ({ cartItems, removeFromCart }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {cartItems.map((itemId, index) => (
                        <li key={index} style={{ margin: '10px 0' }}>
                            <span>Item ID: {itemId}</span>
                            <button onClick={() => removeFromCart(itemId)} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;