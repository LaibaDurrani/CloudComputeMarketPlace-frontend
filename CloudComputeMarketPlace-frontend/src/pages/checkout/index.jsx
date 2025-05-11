import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSidebar } from '../../context/SidebarContext';
import { createRental } from '../../services/api';
import './styles.css';

const Checkout = () => {
  const { isSidebarOpen } = useSidebar();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots, computer, totalPrice, startDate, endDate, rentalType, hours } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redirect to dashboard if checkout data is missing
  useEffect(() => {
    if (!computer || !selectedSlots || !totalPrice) {
      navigate('/dashboard');
    }
  }, [computer, selectedSlots, totalPrice, navigate]);
  // Format the booking details
  const formatBookingDetails = () => {
    if (!selectedSlots || selectedSlots.length === 0 || !startDate) return null;
    
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format time range
    const startTime = new Date(startDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endTime = new Date(endDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      date: formattedStartDate,
      timeRange: `${startTime} - ${endTime}`,
      duration: `${hours} hour${hours > 1 ? 's' : ''}`
    };
  };

  const bookingDetails = formatBookingDetails();
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!computer) {
      setError('Missing computer data');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Format payment info
      const paymentInfo = {
        method: paymentMethod,
        transactionId: `trans_${Date.now()}`, // Simulate transaction ID
        isPaid: true,
        paidAt: new Date()
      };
      
      // Create rental data object
      const rentalData = {
        computerId: computer._id,
        startDate: startDate,
        endDate: endDate,
        rentalType: rentalType,
        paymentInfo: paymentInfo
      };
      
      // Call the API to create rental
      const response = await createRental(rentalData);
      
      // Navigate to confirmation page with rental details
      navigate('/rental-confirmation', { 
        state: { 
          rental: response.data.data,
          computer: computer
        }
      });
    } catch (err) {
      console.error('Error creating rental:', err);
      setError(err.response?.data?.error || 'Failed to complete rental. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="checkout-content">
          <h1>Checkout</h1>
          
          <div className="checkout-grid">
            <section className="booking-summary">              <h2>Booking Summary</h2>
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
              <div className="summary-details">
                <div className="summary-row">
                  <span className="label">Computer:</span>
                  <span className="value">{computer?.title || 'Computer'}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Date:</span>
                  <span className="value">{bookingDetails?.date || 'N/A'}</span>
                </div>
                {bookingDetails?.timeRange && (
                  <div className="summary-row">
                    <span className="label">Time:</span>
                    <span className="value">{bookingDetails.timeRange}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="label">Duration:</span>
                  <span className="value">{bookingDetails?.duration || 'N/A'}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Hours Selected:</span>
                  <span className="value">{hours || selectedSlots?.length || 0}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Rate per Hour:</span>
                  <span className="value">${computer?.price?.hourly || 0}</span>
                </div>
                <div className="summary-row total">
                  <span className="label">Total Amount:</span>
                  <span className="value">${totalPrice || 0}</span>
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

            <section className="price-summary-card">
              <button 
                className="confirm-payment-btn"
                onClick={handlePaymentSubmit}
                disabled={!selectedSlots?.length}
              >
                Confirm Payment
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
