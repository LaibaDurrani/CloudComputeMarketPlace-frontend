import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

const RentalConfirmation = () => {
  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { rental, computer } = location.state || {};

  if (!rental || !computer) {
    // Redirect to dashboard if there's no rental data
    navigate('/dashboard');
    return null;
  }

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startDate = formatDate(rental.startDate);
  const endDate = formatDate(rental.endDate);

  return (
    <div className={`rental-confirmation-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      <div className="confirmation-content">
        <div className="confirmation-card">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Your rental has been successfully confirmed and is now pending approval from the seller.
          </p>
          
          <div className="rental-details">
            <h2>Rental Details</h2>
            <div className="detail-row">
              <span className="detail-label">Computer:</span>
              <span className="detail-value">{computer.title}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rental ID:</span>
              <span className="detail-value">{rental._id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Start Time:</span>
              <span className="detail-value">{startDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">End Time:</span>
              <span className="detail-value">{endDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rental Type:</span>
              <span className="detail-value">{rental.rentalType}</span>
            </div>
            <div className="detail-row total">
              <span className="detail-label">Total Price:</span>
              <span className="detail-value">${rental.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="next-steps">
            <h2>Next Steps</h2>
            <ol>
              <li>The seller will review your booking request.</li>
              <li>Once approved, you'll receive connection details.</li>
              <li>Use the connection details to access your rented computer.</li>
            </ol>
          </div>
          
          <div className="confirmation-actions">
            <button 
              className="primary-btn"
              onClick={() => navigate('/rental-history')}
            >
              View My Rentals
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalConfirmation;
