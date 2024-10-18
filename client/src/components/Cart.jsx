import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => { // Accept userId as a prop
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items for the user
    if (userId) {
      axios.get(`/carts/${userId}`)
        .then((res) => setCartItems(res.data.items))
        .catch((err) => console.log(err));
    }
  }, [userId]); // Add userId as a dependency

  const removeFromCart = (productId) => {
    axios.delete(`/carts/${userId}`, { data: { product_id: productId } })
      .then(() => {
        setCartItems(cartItems.filter(item => item.product_id !== productId));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.product_id}>
              {item.product_name} (x{item.quantity})
              <button onClick={() => removeFromCart(item.product_id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;