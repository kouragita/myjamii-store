// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Cart = ({ userId }) => { // Accept userId as a prop
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     // Fetch cart items for the user
//     if (userId) {
//       axios.get(`/carts/${userId}`)
//         .then((res) => setCartItems(res.data.items))
//         .catch((err) => console.log(err));
//     }
//   }, [userId]); // Add userId as a dependency

//   const removeFromCart = (productId) => {
//     axios.delete(`/carts/${userId}`, { data: { product_id: productId } })
//       .then(() => {
//         setCartItems(cartItems.filter(item => item.product_id !== productId));
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <ul>
//           {cartItems.map(item => (
//             <li key={item.product_id}>
//               {item.product_name} (x{item.quantity})
//               <button onClick={() => removeFromCart(item.product_id)}>Remove</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Cart;

// import React, { useState } from 'react'; 
// import Checkout from './Checkout';

// const Cart = ({ cartItems, removeFromCart }) => {
//     const [isCheckoutVisible, setCheckoutVisible] = useState(false);

//     return (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//             <h2>Cart</h2>
//             {cartItems.length === 0 ? (
//                 <p>Your cart is empty</p>
//             ) : (
//                 <>
//                     <ul style={{ listStyleType: 'none', padding: 0 }}>
//                         {cartItems.map((item, index) => (
//                             <li key={index} style={{ margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
//                                 <div>
//                                     <strong>{item.name}</strong> - ${item.price}
//                                 </div>
//                                 <div>
//                                     Quantity: {item.quantity}
//                                 </div>
//                                 <button onClick={() => removeFromCart(item.product_id)} 
//                                         style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
//                                     Remove
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                     <button
//                         onClick={() => setCheckoutVisible(true)}
//                         style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
//                     >
//                         Proceed to Checkout
//                     </button>
//                     {isCheckoutVisible && (
//                         <Checkout cartItems={cartItems} totalAmount={cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} clearCart={() => {}} />
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default Cart;



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