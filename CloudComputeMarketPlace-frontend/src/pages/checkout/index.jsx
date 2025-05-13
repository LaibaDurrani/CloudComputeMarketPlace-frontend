import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSidebar } from '../../context/SidebarContext';
import { AuthContext } from '../../context/AuthContext';
import { useStats } from '../../context/StatsContext';
import { createRental } from '../../services/api';
import './styles.css';

const Checkout = () => {
  const { isSidebarOpen } = useSidebar();
  const { currentUser } = useContext(AuthContext);
  const { refreshStats } = useStats();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots, computer, totalPrice, startDate, endDate, rentalType, hours } = location.state || {};
  
  // Simplified payment method - now using automatic payment
  const [paymentMethod, setPaymentMethod] = useState('automatic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redirect to dashboard if checkout data is missing
  useEffect(() => {
    if (!computer || !selectedSlots || !totalPrice) {
      navigate('/dashboard');
    }
    
    // Check if user is logged in
    if (!currentUser) {
      setError('You must be logged in to complete a rental');
      // Redirect to login after a short delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [computer, selectedSlots, totalPrice, navigate, currentUser]);
  
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
  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    
    if (!computer) {
      setError('Missing computer data');
      return;
    }
    
    // Check for missing data
    if (!startDate || !endDate) {
      setError('Start and end dates are required');
      return;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Invalid date format');
      return;
    }
    
    if (start >= end) {
      setError('End date must be after start date');
      return;
    }
    
    // Check authentication token
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setError('Authentication token missing. Please login again.');
      return;
    }
    
    // Check for rental type
    if (!rentalType || !['hourly', 'daily', 'weekly', 'monthly'].includes(rentalType)) {
      setError('Invalid rental type');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);      // Create rental data object - no payment info needed anymore
      // Make sure dates are properly formatted as ISO strings
      const rentalData = {
        computerId: computer._id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        rentalType: rentalType
      };
      
      // Debug info
      console.log('Sending rental data:', rentalData);
      console.log('Auth token:', localStorage.getItem('token'));
      console.log('Current user:', currentUser);
        // Call the API to create rental
      const response = await createRental(rentalData);
      
      // Verify that we have valid response data
      if (!response.data || !response.data.data) {
        console.error('Missing response data from rental creation');
        setError('Server returned an invalid response. Please try again.');
        setLoading(false);
        return;
      }
      
      console.log('Rental created successfully:', response.data.data);
      
      // Refresh stats after creating rental
      refreshStats();

      // Navigate to confirmation page with rental details
      navigate('/rental-confirmation', { 
        state: { 
          rental: response.data.data,
          computer: computer
        }
      });} catch (err) {
      console.error('Error creating rental:', err);
        // Enhanced error reporting for debugging
      if (err.response?.data) {
        console.log('Server error response:', err.response.data);
        if (err.response.data.errors) {
          // Handle validation errors from express-validator
          const errorMessages = err.response.data.errors.map(e => e.msg).join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else if (err.response.data.details) {
          // Handle mongoose validation errors
          setError(`Validation error: ${err.response.data.details}`);
        } else {
          setError(err.response.data.error || (err.response.data.message ? `Error: ${err.response.data.message}` : 'Server error occurred'));
        }
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to complete rental. Please try again.');
      }
      
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
            <section className="booking-summary">
              <h2>Booking Summary</h2>
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
              <h2>Direct Rental - No Payment Required</h2>
              <div className="payment-info-box">
                <p>Payments have been disabled for this application. You can rent computers without any payment processing.</p>
                <p>Just click "Complete Rental" to proceed.</p>
              </div>
            </section>

            <section className="price-summary-card">              <button 
                className="confirm-payment-btn"
                onClick={handleRentalSubmit}
                disabled={loading || !selectedSlots?.length}
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Complete Direct Rental'}
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
