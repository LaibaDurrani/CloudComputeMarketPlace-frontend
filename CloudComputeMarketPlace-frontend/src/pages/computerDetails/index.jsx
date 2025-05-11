import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext'; 
import { getComputer } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './styles.css';
import '../../App.css'; 

const ComputerDetails = () => {
  const { isSidebarOpen } = useSidebar();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [computer, setComputer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch computer details from the API
  useEffect(() => {
    const fetchComputer = async () => {
      try {
        setLoading(true);
        const response = await getComputer(id);
        setComputer(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading computer details. Please try again.');
        setLoading(false);
        console.error("Error fetching computer details:", err);
      }
    };
    
    fetchComputer();
  }, [id]);
  const generateTimeSlots = (date) => {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0);
      
      // Check if computer is available based on its current rental status
      // If we have the computer data, check its availability
      const isAvailable = computer ? 
        computer.availability.status === 'available' : 
        Math.random() > 0.3; // Fallback to random if no data
      
      slots.push({
        time: slotTime,
        id: `${date.toDateString()}-${hour}`,
        available: isAvailable,
      });
    }
    return slots;
  };

  useEffect(() => {
    if (computer) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
      setSelectedSlots([]);
    }
  }, [selectedDate, computer]);

  const handleSlotSelect = (slotId) => {
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  // Calculate the total price based on the number of selected slots
  const calculateTotalPrice = () => {
    if (!computer) return "0.00";
    return (selectedSlots.length * computer.price.hourly).toFixed(2);
  };
  
  const totalPrice = calculateTotalPrice();
  const handleCheckout = () => {
    if (!computer) return;
    
    // Create dates from selected slots
    const dates = selectedSlots.map(slot => {
      const [dateStr, hour] = slot.split('-');
      const slotDate = new Date(dateStr);
      slotDate.setHours(parseInt(hour), 0, 0);
      return slotDate;
    }).sort((a, b) => a - b); // Sort dates chronologically
    
    // Get the earliest and latest dates
    const startDate = dates[0];
    const endDate = new Date(dates[dates.length - 1]);
    endDate.setHours(endDate.getHours() + 1); // Add one hour to end date
    
    navigate('/checkout', {
      state: {
        selectedSlots,
        computer,
        totalPrice,
        startDate,
        endDate,
        rentalType: 'hourly',
        hours: selectedSlots.length
      }
    });
  };
  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <div className="error-container">
        <Header />
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // Show 404 message if computer not found
  if (!computer) {
    return (
      <div className="not-found-container">
        <Header />
        <div className="not-found-message">
          <h2>Computer Not Found</h2>
          <p>The computer you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`computer-details-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      <div className="computer-details-content">
        <div className="details-content">
          <div className="details-header">
            <div className="header-left">
              <h1>{computer.title}</h1>
              <div className="owner-info">
                <span className="owner-name">by {computer.user?.name || 'Unknown Seller'}</span>
                <span className="owner-rating">★ {computer.averageRating || 'N/A'}</span>
              </div>
            </div>
            <div className="header-right">
              <div className="price-tag">${computer.price.hourly}/hr</div>
            </div>
          </div>

          <div className="details-grid">
            <div className="main-content">
              <section className='specs-section'>
                <h2>Specifications</h2>
                <div className="specs-grid">
                  {Object.entries(computer.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key.toUpperCase()}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="booking-section">
                <h2>Select Booking Time</h2>
                <div className="date-picker-wrapper">
                  <select 
                    className="date-select"
                    value={selectedDate.toISOString()}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  >
                    {[0, 1].map(days => {
                      const date = new Date();
                      date.setDate(date.getDate() + days);
                      return (
                        <option key={days} value={date.toISOString()}>
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="time-slots">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.id}
                      className={`time-slot ${selectedSlots.includes(slot.id) ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                      onClick={() => slot.available && handleSlotSelect(slot.id)}
                      disabled={!slot.available}
                    >
                      {slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                </div>
              </section>

              <section className="billing-section">
                <div className="billing-card">
                  <h2>Billing Summary</h2>
                  <div className="billing-details">                    <div className="billing-row">
                      <span>Hours Selected</span>
                      <span>{selectedSlots.length}</span>
                    </div>
                    <div className="billing-row">
                      <span>Rate per Hour</span>
                      <span>${computer?.price?.hourly || 0}</span>
                    </div>
                    <div className="billing-row total">
                      <span>Total Amount</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                  <button 
                    className="checkout-btn"
                    disabled={selectedSlots.length === 0}
                    onClick={handleCheckout}  
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </section>
            </div>            <div className="sidebar">
              <div className="availability-card">
                <div className="availability-status">
                  <span className={`status-badge ${computer.availability.status.toLowerCase()}`}>
                    {computer.availability.status.charAt(0).toUpperCase() + computer.availability.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="use-cases-card">
                <h2>Description</h2>
                <p>{computer.description}</p>
              </div>
              
              <div className="location-card">
                <h2>Location</h2>
                <p>{computer.location}</p>
              </div>
              
              {computer.reviews && computer.reviews.length > 0 && (
                <div className="reviews-card">
                  <h2>Reviews</h2>
                  <div className="reviews-list">
                    {computer.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                          <span className="review-rating">{"★".repeat(review.rating)}</span>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComputerDetails;
