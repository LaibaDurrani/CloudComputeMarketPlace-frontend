import React, { useState, useEffect } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { useStats } from '../../context/StatsContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserRentals, getRentedOutComputers, updateRentalStatus, getUserComputers, addRentalAccessDetails } from '../../services/api';
import './styles.css';

const RentalHistory = () => {
  const { isSidebarOpen } = useSidebar();
  const { dashboardMode } = useDashboardMode();
  const { refreshStats } = useStats();
  const [activeTab, setActiveTab] = useState('active');
  const [rentals, setRentals] = useState([]);
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [accessDetails, setAccessDetails] = useState({
    ipAddress: '',
    username: '',
    password: '',
    accessUrl: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        
        // Different API calls based on dashboard mode
        let rentalsData;
        if (dashboardMode === 'seller') {
          // Fetch computers first to get details
          const computersResponse = await getUserComputers();
          setComputers(computersResponse.data.data);
          
          // Get rentals for seller's computers
          const response = await getRentedOutComputers();
          rentalsData = response.data.data;
        } else {
          // Get user's rentals as a buyer
          const response = await getUserRentals();
          rentalsData = response.data.data;
        }
        
        // Set the rentals
        setRentals(rentalsData);
        
        // Calculate rental stats
        const total = rentalsData.length;
        const active = rentalsData.filter(rental => 
          rental.status === 'active'
        ).length;
        const pending = rentalsData.filter(rental => 
          rental.status === 'pending'
        ).length;
        const completed = rentalsData.filter(rental => 
          rental.status === 'completed'
        ).length;
        
        setStats({ total, active, pending, completed });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Failed to load rental history. Please try again.');
        setLoading(false);
      }
    };
    
    fetchRentals();
  }, [dashboardMode]);  const handleUpdateRentalStatus = async (rentalId, status) => {
    try {
      await updateRentalStatus(rentalId, status);
      
      // Update the rentals list
      setRentals(rentals.map(rental => 
        rental._id === rentalId ? { ...rental, status } : rental
      ));
      
      // Refresh sidebar stats when rental status changes
      refreshStats();
      
      // Update local stats after status change
      if (status === 'active') {
        setStats({
          ...stats,
          active: stats.active + 1,
          pending: stats.pending - 1
        });
      } else if (status === 'cancelled') {
        if (rentals.find(r => r._id === rentalId).status === 'pending') {
          setStats({
            ...stats,
            pending: stats.pending - 1
          });
        } else if (rentals.find(r => r._id === rentalId).status === 'active') {
          setStats({
            ...stats,
            active: stats.active - 1
          });
        }
      } else if (status === 'completed') {
        setStats({
          ...stats,
          active: stats.active - 1,
          completed: stats.completed + 1
        });
      }
      refreshStats();
    } catch (err) {
      console.error(`Error updating rental to ${status}:`, err);
      setError(`Failed to update rental status. Please try again.`);
    }
  };
  
  const handleApproveRental = (rentalId) => {
    handleUpdateRentalStatus(rentalId, 'active');
  };
  
  const handleRejectRental = (rentalId) => {
    handleUpdateRentalStatus(rentalId, 'cancelled');
  };
  
  const handleCancelRental = (rentalId) => {
    handleUpdateRentalStatus(rentalId, 'cancelled');
  };
  
  const handleCompleteRental = (rentalId) => {
    handleUpdateRentalStatus(rentalId, 'completed');
  };

  const handleShowAccessForm = (rental) => {
    setSelectedRental(rental);
    
    // Pre-fill form if access details already exist
    if (rental.accessDetails) {
      setAccessDetails({
        ipAddress: rental.accessDetails.ipAddress || '',
        username: rental.accessDetails.username || '',
        password: '', // Don't pre-fill password for security
        accessUrl: rental.accessDetails.accessUrl || ''
      });
    } else {
      // Reset form
      setAccessDetails({
        ipAddress: '',
        username: '',
        password: '',
        accessUrl: ''
      });
    }
    
    setShowAccessForm(true);
  };

  const handleCloseAccessForm = () => {
    setShowAccessForm(false);
    setSelectedRental(null);
  };

  const handleAccessDetailsChange = (e) => {
    const { name, value } = e.target;
    setAccessDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAccessDetails = async (e) => {
    e.preventDefault();
    
    if (!selectedRental) return;
    
    try {
      await addRentalAccessDetails(selectedRental._id, accessDetails);
      
      // Update the rentals list
      setRentals(rentals.map(rental => 
        rental._id === selectedRental._id 
          ? { 
              ...rental, 
              accessDetails: {
                ...accessDetails,
                password: undefined // Don't store password in state
              } 
            } 
          : rental
      ));
        setShowAccessForm(false);
      setSelectedRental(null);
      
      // Refresh sidebar stats after updating access details
      refreshStats();
      
      // Show success message (you could add a toast/notification here)
      alert('Access details saved successfully');
    } catch (err) {
      console.error('Error saving access details:', err);
      alert('Failed to save access details. Please try again.');
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You could add a small notification here
        alert(`${field} copied to clipboard!`);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const renderRentals = () => {
    // Filter rentals based on active tab
    const filteredRentals = rentals.filter(rental => {
      if (activeTab === 'active') {
        return rental.status === 'active' || rental.status === 'pending';
      } else {
        return rental.status === 'completed' || rental.status === 'cancelled';
      }
    });
    
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (filteredRentals.length === 0) {
      return (
        <div className="no-rentals-message">
          <p>{activeTab === 'active' 
            ? 'No active rentals found.' 
            : 'No rental history found.'}</p>
        </div>
      );
    }

    return (
      <div className="rentals-items">
        {filteredRentals.map(rental => {
          // Format dates
          const startDate = new Date(rental.startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          
          // Format times
          const startTime = new Date(rental.startDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          const endTime = new Date(rental.endDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          // Calculate duration in hours
          const durationHours = Math.round((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60));
          
          const isPending = rental.status === 'pending';
          const isActive = rental.status === 'active';
          const isCompleted = rental.status === 'completed';
          const isCancelled = rental.status === 'cancelled';
          
          // If we're in seller mode, we need to find the computer details
          let computerInfo = rental.computer || {};
          
          if (dashboardMode === 'seller') {
            // Find the computer in our stored computers array
            const computerMatch = computers.find(c => c._id === rental.computer);
            if (computerMatch) {
              computerInfo = computerMatch;
            }
          }
          
          // Get renter information
          const renterInfo = rental.user || { name: 'Unknown User', email: 'unknown@example.com' };
          
          return (
            <div key={rental._id} className="rental-item">
              <div className="rental-header">
                <h3>{computerInfo.title || 'Computer'}</h3>
                <span className={`status ${rental.status}`}>
                  {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                </span>
              </div>
              <div className="rental-details">
                <p>Date: {startDate}</p>
                <p>Time: {startTime} - {endTime}</p>
                <p>Duration: {durationHours} hour{durationHours !== 1 ? 's' : ''}</p>
                <p>Total Price: ${rental.totalPrice.toFixed(2)}</p>
                
                {/* Show different information based on dashboard mode */}
                {dashboardMode === 'seller' && (
                  <div className="renter-info">
                    <p>Rented by: {renterInfo.name || 'Unknown User'}</p>
                    <p>Contact: {renterInfo.email || 'N/A'}</p>
                  </div>
                )}
                
                {dashboardMode === 'buyer' && isPending && (
                  <div className="rental-actions">
                    <p className="pending-message">Waiting for seller approval</p>
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelRental(rental._id)}
                    >
                      Cancel Rental
                    </button>
                  </div>
                )}
                
                {dashboardMode === 'seller' && isPending && (
                  <div className="rental-actions">
                    <div className="action-btns">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApproveRental(rental._id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectRental(rental._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
                  {dashboardMode === 'buyer' && isActive && (
                  <div className="rental-actions">
                    <button 
                      className="connect-btn"
                      onClick={() => rental.accessDetails ? handleShowAccessForm(rental) : alert('Access details not yet provided by the owner')}
                    >
                      Connect Now
                    </button>
                  </div>
                )}
                  {dashboardMode === 'seller' && isActive && (
                  <div className="rental-actions">
                    <button 
                      className="complete-btn"
                      onClick={() => handleCompleteRental(rental._id)}
                    >
                      Mark as Complete
                    </button>
                    <button 
                      className="access-btn"
                      onClick={() => handleShowAccessForm(rental)}
                    >
                      {rental.accessDetails ? 'Edit Access Details' : 'Add Access Details'}
                    </button>
                  </div>
                )}
                
                {isCompleted && (
                  <p className="completion-time">
                    Completed at: {new Date(rental.endDate).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="rentals-content">          <h1>{dashboardMode === 'seller' ? 'Rental Requests' : 'Rental History'}</h1>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}
          
          <div className="rental-stats">
            <div className="stat-card">
              <h3>Total Rentals</h3>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card">
              <h3>Active Rentals</h3>
              <span className="stat-value">{stats.active}</span>
            </div>
            {dashboardMode === 'seller' && (
              <div className="stat-card">
                <h3>Pending Requests</h3>
                <span className="stat-value">{stats.pending}</span>
              </div>
            )}
            <div className="stat-card">
              <h3>Completed Rentals</h3>
              <span className="stat-value">{stats.completed}</span>
            </div>
          </div>

          <div className="rentals-list">
            <div className="rental-tabs">
              <button 
                className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active
              </button>
              <button 
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>
            
            {renderRentals()}
          </div>
        </div>      </div>

      {/* Access Details Form Modal */}
      {showAccessForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Computer Access Details</h2>
              <button className="close-btn" onClick={handleCloseAccessForm}>×</button>
            </div>
            <form onSubmit={dashboardMode === 'seller' ? handleSubmitAccessDetails : (e) => e.preventDefault()}>              <div className="form-group">
                <label htmlFor="ipAddress">IP Address:</label>
                <div className="input-with-copy">
                  <input
                    type="text"
                    id="ipAddress"
                    name="ipAddress"
                    value={accessDetails.ipAddress}
                    onChange={handleAccessDetailsChange}
                    placeholder="e.g. 192.168.1.1"
                    required
                    readOnly={dashboardMode === 'buyer'}
                  />
                  {dashboardMode === 'buyer' && (
                    <button type="button" className="copy-btn" onClick={() => copyToClipboard(accessDetails.ipAddress, "IP Address")}>
                      Copy
                    </button>
                  )}
                </div>
              </div>              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <div className="input-with-copy">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={accessDetails.username}
                    onChange={handleAccessDetailsChange}
                    placeholder="e.g. admin"
                    required
                    readOnly={dashboardMode === 'buyer'}
                  />
                  {dashboardMode === 'buyer' && (
                    <button type="button" className="copy-btn" onClick={() => copyToClipboard(accessDetails.username, "Username")}>
                      Copy
                    </button>
                  )}
                </div>
              </div>              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <div className="input-with-copy">
                  <input
                    type={dashboardMode === 'buyer' ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={accessDetails.password}
                    onChange={handleAccessDetailsChange}
                    placeholder="Enter password"
                    required
                    readOnly={dashboardMode === 'buyer'}
                  />
                  {dashboardMode === 'buyer' && (
                    <button type="button" className="copy-btn" onClick={() => copyToClipboard(accessDetails.password, "Password")}>
                      Copy
                    </button>
                  )}
                </div>
              </div>              <div className="form-group">
                <label htmlFor="accessUrl">Access URL:</label>
                <div className="input-with-copy">
                  <input
                    type="text"
                    id="accessUrl"
                    name="accessUrl"
                    value={accessDetails.accessUrl}
                    onChange={handleAccessDetailsChange}
                    placeholder="e.g. https://remote-access.example.com"
                    required
                    readOnly={dashboardMode === 'buyer'}
                  />
                  {dashboardMode === 'buyer' && (
                    <button type="button" className="copy-btn" onClick={() => copyToClipboard(accessDetails.accessUrl, "Access URL")}>
                      Copy
                    </button>
                  )}
                </div>
              </div>              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseAccessForm}>
                  {dashboardMode === 'buyer' ? 'Close' : 'Cancel'}
                </button>
                {dashboardMode === 'seller' && (
                  <button type="submit" className="save-btn">
                    Save Access Details
                  </button>
                )}
                {dashboardMode === 'buyer' && accessDetails.accessUrl && (
                  <a 
                    href={accessDetails.accessUrl.startsWith('http') ? accessDetails.accessUrl : `https://${accessDetails.accessUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="connect-direct-btn"
                  >
                    Connect Directly
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RentalHistory;