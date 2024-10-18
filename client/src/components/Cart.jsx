import React from 'react';

const Cart = ({ cartItems, removeFromCart }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {cartItems.map((item, index) => (
                        <li key={index} style={{ margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                            <div>
                                <strong>{item.name}</strong> - ${item.price}
                            </div>
                            <div>
                                Quantity: {item.quantity}
                            </div>
                            <button onClick={() => removeFromCart(item.product_id)} 
                                    style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
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
