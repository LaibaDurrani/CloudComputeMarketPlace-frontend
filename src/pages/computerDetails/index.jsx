import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext'; 
import './styles.css';
import '../../App.css'; 

const ComputerDetails = () => {
  const { isSidebarOpen } = useSidebar();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const computerData = {
    name: "Deep Learning Workstation",
    owner: "John Doe",
    price: 8.50,
    specs: {
      cpu: "AMD Threadripper 3990X",
      ram: "128GB DDR4",
      gpu: "2x NVIDIA A100",
      storage: "4TB NVMe SSD"
    },
    useCases: ["AI Training", "Data Processing"],
    status: "Available",
    rating: 4.8
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0);
      slots.push({
        time: slotTime,
        id: `${date.toDateString()}-${hour}`,
        available: Math.random() > 0.3, 
      });
    }
    return slots;
  };

  useEffect(() => {
    const slots = generateTimeSlots(selectedDate);
    setTimeSlots(slots);
    setSelectedSlots([]);
  }, [selectedDate]);

  const handleSlotSelect = (slotId) => {
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  const totalPrice = (selectedSlots.length * computerData.price).toFixed(2);

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        selectedSlots,
        computerData,
        totalPrice
      }
    });
  };

  return (
    <div className={`computer-details-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      <div className="computer-details-content">
        <div className="details-content">
          <div className="details-header">
            <div className="header-left">
              <h1>{computerData.name}</h1>
              <div className="owner-info">
                <span className="owner-name">by {computerData.owner}</span>
                <span className="owner-rating">★ {computerData.rating}</span>
              </div>
            </div>
            <div className="header-right">
              <div className="price-tag">${computerData.price}/hr</div>
            </div>
          </div>

          <div className="details-grid">
            <div className="main-content">
              <section className='specs-section'>
                <h2>Specifications</h2>
                <div className="specs-grid">
                  {Object.entries(computerData.specs).map(([key, value]) => (
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
                  <div className="billing-details">
                    <div className="billing-row">
                      <span>Hours Selected</span>
                      <span>{selectedSlots.length}</span>
                    </div>
                    <div className="billing-row">
                      <span>Rate per Hour</span>
                      <span>${computerData.price}</span>
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
            </div>

            <div className="sidebar">
              <div className="availability-card">
                <div className="availability-status">
                  <span className={`status-badge ${computerData.status.toLowerCase()}`}>
                    {computerData.status}
                  </span>
                </div>
              </div>

              <div className="use-cases-card">
                <h2>Use Cases</h2>
                <div className="use-cases-list">
                  {computerData.useCases.map(useCase => (
                    <span key={useCase} className="use-case-tag">{useCase}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComputerDetails;
