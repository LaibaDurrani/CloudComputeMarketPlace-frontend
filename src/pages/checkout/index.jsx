import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import './styles.css';

const Checkout = () => {
  const { id } = useParams();
  const [rentalDuration, setRentalDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="checkout">
      <Header />
      <div className="checkout-content">
        <div className="checkout-grid">
          <div className="main-checkout">
            <h1>Complete Your Rental</h1>
            
            <section className="rental-duration">
              <h2>Rental Duration</h2>
              <div className="duration-selector">
                <button 
                  onClick={() => setRentalDuration(prev => Math.max(1, prev - 1))}
                  className="duration-btn"
                >-</button>
                <span>{rentalDuration} {rentalDuration === 1 ? 'hour' : 'hours'}</span>
                <button 
                  onClick={() => setRentalDuration(prev => prev + 1)}
                  className="duration-btn"
                >+</button>
              </div>
            </section>

            <section className="payment-method">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">💳</span>
                    Credit/Debit Card
                  </span>
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">🅿️</span>
                    PayPal
                  </span>
                </label>
              </div>
            </section>

            <section className="payment-details">
              <h2>Payment Details</h2>
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input type="text" placeholder="John Doe" />
                </div>
              </div>
            </section>
          </div>

          <aside className="order-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <span>Rental Rate</span>
                  <span>$8.50/hr</span>
                </div>
                <div className="summary-item">
                  <span>Duration</span>
                  <span>{rentalDuration} hours</span>
                </div>
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>${(8.50 * rentalDuration).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Service Fee</span>
                  <span>$2.00</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>${(8.50 * rentalDuration + 2).toFixed(2)}</span>
                </div>
              </div>
              <button className="confirm-payment">Confirm Payment</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;