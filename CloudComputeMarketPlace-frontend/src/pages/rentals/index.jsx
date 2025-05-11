import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserRentals, addRentalAccessDetails } from '../../services/api';
import './styles.css';

const MyRentals = () => {
  const { isSidebarOpen } = useSidebar();
  const { currentUser } = useContext(AuthContext);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRentalUrl, setActiveRentalUrl] = useState("about:blank");
  const [selectedRental, setSelectedRental] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'pending', 'completed', 'all'

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await getUserRentals();
        setRentals(response.data.data);
        console.log('Fetched rentals:', response.data.data);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Failed to load rentals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchRentals();
    }
  }, [currentUser]);

  const handleFullScreen = () => {
    const iframe = document.getElementById('screenShare');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen();
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  const handleConnectNow = (rental) => {
    if (rental.accessDetails && rental.accessDetails.accessUrl) {
      setActiveRentalUrl(rental.accessDetails.accessUrl);
      setSelectedRental(rental);
    } else {
      // For development/testing purposes, use a sandbox URL when real access details aren't available
      // In production, you might want to show an error message instead
      const sandboxUrl = "https://codepen.io/pen/";
      console.log('Using sandbox URL for testing as no access details are available');
      setActiveRentalUrl(sandboxUrl);
      setSelectedRental(rental);
      
      // Uncomment in production to prevent connection without proper access details
      // alert('Access details not available for this rental. Please contact the owner.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate duration between two dates
  const calculateDuration = (startDate, endDate, rentalType) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    
    switch(rentalType) {
      case 'hourly':
        const hours = Math.ceil(diffTime / (1000 * 60 * 60));
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      case 'daily':
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${days} day${days !== 1 ? 's' : ''}`;
      case 'weekly':
        const weeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      case 'monthly':
        const months = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        return `${months} month${months !== 1 ? 's' : ''}`;
      default:
        return 'Unknown duration';
    }
  };

  // Filter rentals based on active tab
  const filteredRentals = useMemo(() => {
    if (activeTab === 'all') {
      return rentals;
    }
    return rentals.filter(rental => rental.status === activeTab);
  }, [rentals, activeTab]);

  // Count rentals by status for tab badges
  const rentalCounts = useMemo(() => {
    return {
      active: rentals.filter(r => r.status === 'active').length,
      pending: rentals.filter(r => r.status === 'pending').length, 
      completed: rentals.filter(r => r.status === 'completed').length,
      cancelled: rentals.filter(r => r.status === 'cancelled').length,
      all: rentals.length
    };
  }, [rentals]);

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="rentals-content">
          <h1>My Rentals</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="rentals-grid">
            <section className="screen-share-section">
              <div className="iframe-container">
                {selectedRental ? (
                  <div className="connection-details">
                    <h3>Connected to: {selectedRental.computer.title}</h3>
                  </div>
                ) : (
                  <div className="no-connection">
                    <p>Select a rental from the list and click "Connect Now" to access the computer</p>
                  </div>
                )}
                <iframe
                  id="screenShare"
                  src={activeRentalUrl}
                  title="Remote Computer Access"
                  allow="fullscreen"
                />
                <button 
                  className="fullscreen-btn"
                  onClick={handleFullScreen}
                  disabled={!selectedRental}
                >
                  {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                </button>
              </div>
            </section>

            <section className="rentals-list">
              <div className="tabs-container">
                <button 
                  className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Active
                  {rentalCounts.active > 0 && <span className="badge">{rentalCounts.active}</span>}
                </button>
                <button 
                  className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending
                  {rentalCounts.pending > 0 && <span className="badge">{rentalCounts.pending}</span>}
                </button>
                <button 
                  className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                  {rentalCounts.completed > 0 && <span className="badge">{rentalCounts.completed}</span>}
                </button>
                <button 
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                  {rentalCounts.all > 0 && <span className="badge">{rentalCounts.all}</span>}
                </button>
              </div>
              
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Rentals</h2>
              
              {loading ? (
                <div className="loading-container">
                  <LoadingSpinner />
                  <p>Loading your rentals...</p>
                </div>
              ) : filteredRentals.length === 0 ? (
                <div className="no-rentals">
                  <p>You don't have any {activeTab} rentals.</p>
                  {activeTab === 'active' && (
                    <p>Browse available computers and rent one to get started!</p>
                  )}
                </div>
              ) : (
                <div className="rentals-items">
                  {filteredRentals.map(rental => (
                    <div 
                      key={rental._id} 
                      className={`rental-item ${selectedRental && selectedRental._id === rental._id ? 'selected' : ''}`}
                    >
                      <div className="rental-header">
                        <h3>{rental.computer.title}</h3>
                        <span className={`status ${rental.status}`}>{rental.status}</span>
                      </div>
                      <div className="rental-details">
                        <p>Start: {formatDate(rental.startDate)}</p>
                        <p>End: {formatDate(rental.endDate)}</p>
                        <p>Duration: {calculateDuration(rental.startDate, rental.endDate, rental.rentalType)}</p>
                        <div className="rental-actions">
                          {rental.status === 'active' && (
                            <button 
                              className="connect-btn"
                              onClick={() => handleConnectNow(rental)}
                              disabled={!rental.accessDetails}
                              title={!rental.accessDetails ? "Access details not available" : "Connect to this computer"}
                            >
                              Connect Now
                            </button>
                          )}
                          {rental.status === 'pending' && (
                            <div className="status-message">Awaiting activation by owner</div>
                          )}
                          {rental.status === 'completed' && (
                            <div className="status-message">This rental has ended</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRentals;