import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

const Checkout = () => {
  const { isSidebarOpen } = useSidebar();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots, computerData, totalPrice } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Format the booking details
  const formatBookingDetails = () => {
    if (!selectedSlots || selectedSlots.length === 0) return null;
    
    const slots = selectedSlots.sort();
    const firstSlot = new Date(slots[0].split('-')[0]);
    const date = firstSlot.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });

    return {
      date,
      duration: `${selectedSlots.length} hour${selectedSlots.length > 1 ? 's' : ''}`
    };
  };

  const bookingDetails = formatBookingDetails();

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Add payment processing logic here
    navigate('/confirmation'); // Navigate to confirmation page after payment
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="checkout-content">
          <h1>Checkout</h1>
          
          <div className="checkout-grid">
            <div className="main-content">
              <section className="booking-summary">
                <h2>Booking Summary</h2>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="label">Computer:</span>
                    <span className="value">{computerData?.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Date:</span>
                    <span className="value">{bookingDetails?.date}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Duration:</span>
                    <span className="value">{bookingDetails?.duration}</span>
                  </div>
                </div>
              </section>

              <section className="payment-method">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <div className="payment-option">
                    <input 
                      type="radio" 
                      id="card" 
                      name="payment" 
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="card">Credit/Debit Card</label>
                  </div>
                  <div className="payment-option">
                    <input 
                      type="radio" 
                      id="paypal" 
                      name="payment" 
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <form className="card-details" onSubmit={handlePaymentSubmit}>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardName">Cardholder Name</label>
                      <input
                        type="text"
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardExpiry">Expiry Date</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardCvv">CVV</label>
                        <input
                          type="text"
                          id="cardCvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </form>
                )}
              </section>
            </div>

            <div className="sidebar">
              <div className="price-summary-card">
                <h2>Price Summary</h2>
                <div className="price-details">
                  <div className="price-row">
                    <span>Hours Selected</span>
                    <span>{selectedSlots?.length || 0}</span>
                  </div>
                  <div className="price-row">
                    <span>Rate per Hour</span>
                    <span>${computerData?.price || 0}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>${totalPrice || 0}</span>
                  </div>
                </div>
                <button 
                  className="confirm-payment-btn"
                  onClick={handlePaymentSubmit}
                  disabled={!selectedSlots?.length}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
