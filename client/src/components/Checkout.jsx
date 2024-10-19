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
        <div style={styles.checkoutPage}>
            <div style={styles.checkoutHeader}>
                <h1 style={styles.headerTitle}>Checkout</h1>
                <p style={styles.totalAmount}>Total Amount: ${totalAmount.toFixed(2)}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="paymentMethod">Choose a payment method:</label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                        required
                        style={styles.selectInput}
                    >
                        <option value="">Select a payment method</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="mobile">Mobile Pay</option>
                    </select>
                </div>

                {/* Conditional rendering based on selected payment method */}
                {showForm && (
                    paymentMethod === 'card' ? (
                        <>
                            <div style={styles.formGroup}>
                                <label htmlFor="cardName">Name on Card</label>
                                <input type="text" name="cardName" placeholder="Name on Card" required style={styles.textInput} />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" name="cardNumber" placeholder="Card Number" required style={styles.textInput} />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                                <input type="text" name="expiryDate" placeholder="Expiry Date (MM/YY)" required style={styles.textInput} />
                            </div>
                            <div style={styles.formGroup}>
                                <label htmlFor="cvv">CVV</label>
                                <input type="text" name="cvv" placeholder="CVV" required style={styles.textInput} />
                            </div>
                        </>
                    ) : (
                        paymentMethod === 'mobile' && (
                            <>
                                <div style={styles.formGroup}>
                                    <label htmlFor="mobileName">Name</label>
                                    <input type="text" name="mobileName" placeholder="Name" required style={styles.textInput} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="phoneNumber">Enter Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Enter Mobile Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        style={styles.textInput}
                                    />
                                </div>
                            </>
                        )
                    )
                )}

                {showForm && (
                    <button type="submit" style={styles.checkoutButton}>
                        Pay Now
                    </button>
                )}
            </form>
        </div>
    );
};

const styles = {
    checkoutPage: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    checkoutHeader: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    headerTitle: {
        fontSize: '24px',
        margin: '0',
        color: '#333',
    },
    totalAmount: {
        color: '#333',
    },
    formGroup: {
        marginBottom: '20px',
    },
    selectInput: {
        width: '100%',
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    textInput: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    checkoutButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default Checkout;
