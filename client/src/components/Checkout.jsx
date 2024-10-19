import React, { useState } from 'react';

const Checkout = ({ cartItems, totalAmount, clearCart }) => {
  const [paymentMethod, setPaymentMethod] = useState(''); // Track selected payment method
  const [phoneNumber, setPhoneNumber] = useState(''); // Track phone number for mobile payment
  const [showForm, setShowForm] = useState(false); // Track whether to show the payment method form

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setShowForm(true);
  };

  // Handle form submission for payment
  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      // Simulate card payment process
      alert('Payment successful with card! (This is a demo)');
      clearCart(); // Clear cart after successful payment
    } else if (paymentMethod === 'mobile') {
      // Simulate mobile payment process
      if (phoneNumber) {
        alert(`A prompt has been sent to your phone number ${phoneNumber}. Please enter your PIN to complete the payment.`);
        clearCart(); // Clear cart after successful payment
      } else {
        alert('Please enter a valid phone number.');
      }
    }
  };

  return (
    <div className="checkout-form" style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Checkout</h2>
      <p>Total Amount: ${totalAmount.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        <h3>Payment Method</h3>
        <label htmlFor="paymentMethod">Choose a payment method:</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          required
          style={{ margin: '10px 0', padding: '10px' }}
        >
          <option value="">Select a payment method</option>
          <option value="card">Credit/Debit Card</option>
          <option value="mobile">Mobile Pay</option>
        </select>

        {/* Conditional rendering based on selected payment method */}
        {showForm && (
          paymentMethod === 'card' ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name on Card"
                required
                style={{ display: 'block', margin: '10px 0', padding: '10px' }}
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                required
                style={{ display: 'block', margin: '10px 0', padding: '10px' }}
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                required
                style={{ display: 'block', margin: '10px 0', padding: '10px' }}
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                required
                style={{ display: 'block', margin: '10px 0', padding: '10px' }}
              />
            </>
          ) : (
            paymentMethod === 'mobile' && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  style={{ display: 'block', margin: '10px 0', padding: '10px' }}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{ display: 'block', margin: '10px 0', padding: '10px' }}
                />
              </>
            )
          )
        )}

        {showForm && (
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', marginTop: '20px' }}>
            Pay Now
          </button>
        )}
      </form>
    </div>
  );
};

export default Checkout;
