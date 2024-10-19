import React, { useState } from 'react'; 

const Checkout = ({ cartItems, totalAmount, clearCart }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bankDetails, setBankDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handlePayment = () => {
        setTimeout(() => {
            const paymentSuccess = Math.random() > 0.5;
            if (paymentSuccess) {
                alert('Payment Successful! A prompt message has been sent to you. Thank you for your purchase.');
                clearCart();
            } else {
                alert('Payment Failed! Please try again.');
            }
        }, 1000);
    };

    const handleBankDetailsChange = (e) => {
        const { name, value } = e.target;
        setBankDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;

        // Allow only integers and limit to 10 digits
        if (/^\d{0,10}$/.test(value)) {
            setPhoneNumber(value);
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value;

        // Allow only integers
        if (/^\d*$/.test(value)) {
            setBankDetails(prevDetails => ({
                ...prevDetails,
                cardNumber: value
            }));
        }
    };

    const handleExpiryDateChange = (e) => {
        const value = e.target.value;

        // Allow only digits and '/' and limit to 5 characters (MM/YY)
        if (/^(0[1-9]|1[0-2])?\/?\d{0,2}$/.test(value) || value === '') {
            setBankDetails(prevDetails => ({
                ...prevDetails,
                expiryDate: value
            }));
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Checkout</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="mobileMoney"
                                checked={paymentMethod === 'mobileMoney'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Mobile Money
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                value="bankCard"
                                checked={paymentMethod === 'bankCard'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Bank Card
                        </label>
                    </div>

                    {paymentMethod && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Amount to be deducted: ${totalAmount.toFixed(2)}</h4>
                        </div>
                    )}

                    {paymentMethod === 'mobileMoney' && (
                        <div>
                            <label>
                                Phone Number:
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    required
                                />
                            </label>
                        </div>
                    )}

                    {paymentMethod === 'bankCard' && (
                        <div>
                            <label>
                                Card Number:
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={bankDetails.cardNumber}
                                    onChange={handleCardNumberChange}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Expiry Date (MM/YY):
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={bankDetails.expiryDate}
                                    onChange={handleExpiryDateChange}
                                    required
                                    maxLength={5} // Limit input to 5 characters
                                />
                            </label>
                            <br />
                            <label>
                                CVV:
                                <input
                                    type="text"
                                    name="cvv"
                                    value={bankDetails.cvv}
                                    onChange={handleBankDetailsChange}
                                    required
                                    maxLength={3} // Typically CVV is 3 digits
                                />
                            </label>
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                        disabled={!paymentMethod}
                    >
                        Pay Now
                    </button>
                </>
            )}
        </div>
    );
};

export default Checkout;


