import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { useStats } from '../../context/StatsContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationPopup from '../../components/ConfirmationPopup';
import { getUserComputers, getRentedOutComputers, deleteComputer } from '../../services/api';
import './styles.css';

const MyListings = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const { refreshStats } = useStats();
  const [listings, setListings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [computerToDelete, setComputerToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeRentals: 0,
    totalHours: 0
  });

  useEffect(() => {
    const fetchListingsData = async () => {
      try {
        setLoading(true);
        
        // Fetch the user's computers (listings)
        const computersResponse = await getUserComputers();
        const userComputers = computersResponse.data.data;
        
        // Fetch rentals of user's computers
        const rentedOutResponse = await getRentedOutComputers();
        const userRentals = rentedOutResponse.data.data;
        setRentals(userRentals);
        
        // Process computers with rental data
        const processedListings = userComputers.map(computer => {
          // Find rentals for this computer
          const computerRentals = userRentals.filter(rental => 
            rental.computer === computer._id
          );
          
          // Calculate total earnings for this computer
          const totalEarnings = computerRentals
            .filter(rental => rental.status === 'completed')
            .reduce((sum, rental) => sum + rental.totalPrice, 0);
          
          // Calculate total hours rented for this computer
          const totalHours = computerRentals
            .filter(rental => rental.status === 'completed')
            .reduce((sum, rental) => {
              const start = new Date(rental.startDate);
              const end = new Date(rental.endDate);
              const hours = Math.round((end - start) / (1000 * 60 * 60));
              return sum + hours;
            }, 0);
          
          // Calculate active rentals for this computer
          const activeRentals = computerRentals.filter(
            rental => rental.status === 'active'
          ).length;
          
          // Determine status based on active rentals
          let status = activeRentals > 0 ? "In Use" : "Available";
          
          return {
            id: computer._id,
            name: computer.title,
            specs: computer.specs,
            price: computer.price.hourly,
            status,
            totalEarnings,
            totalHours,
            activeRentals
          };
        });
        
        setListings(processedListings);
        
        // Calculate overall stats
        const totalEarnings = processedListings.reduce(
          (sum, listing) => sum + listing.totalEarnings, 0
        );
        
        const activeRentals = processedListings.reduce(
          (sum, listing) => sum + listing.activeRentals, 0
        );
        
        const totalHours = processedListings.reduce(
          (sum, listing) => sum + listing.totalHours, 0
        );
        
        setStats({
          totalEarnings: totalEarnings.toFixed(2),
          activeRentals,
          totalHours
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching listings data:', err);
        setError('Failed to load listings data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchListingsData();
  }, []);
  const handleEdit = (listingId) => {
    navigate(`/edit-computer/${listingId}`);
  };
  
  const initiateDelete = (listingId) => {
    setComputerToDelete(listingId);
    setIsConfirmationOpen(true);
  };
  const confirmDelete = async () => {
    try {
      const listingId = computerToDelete;
      await deleteComputer(listingId);
      
      // Update the listings state by filtering out the deleted listing
      setListings(listings.filter(listing => listing.id !== listingId));
      
      // Update the stats
      const updatedListings = listings.filter(listing => listing.id !== listingId);
      const totalEarnings = updatedListings.reduce(
        (sum, listing) => sum + listing.totalEarnings, 0
      );
      
      const activeRentals = updatedListings.reduce(
        (sum, listing) => sum + listing.activeRentals, 0
      );
      
      const totalHours = updatedListings.reduce(
        (sum, listing) => sum + listing.totalHours, 0
      );
      
      // Refresh sidebar stats after deletion
      refreshStats();
      
      setStats({
        totalEarnings: totalEarnings.toFixed(2),
        activeRentals,
        totalHours
      });
      
      // Close the confirmation popup
      setIsConfirmationOpen(false);
      setComputerToDelete(null);
      refreshStats();
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing. Please try again.');
      setIsConfirmationOpen(false);
    }
  };
  
  const handleAddComputer = () => {
    navigate('/add-computer');
  };

  if (loading) {
    return (
      <>
        <Header />
        <Sidebar />
        <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="listings-container">
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="listings-container">          <div className="listings-header">
            <h1>My Listed Computers</h1>
            <button 
              className="add-listing-btn"
              onClick={handleAddComputer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
              </svg>
              Add New Computer
            </button>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}

          <div className="stats-overview">
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">${stats.totalEarnings}</p>
            </div>
            <div className="stat-card">
              <h3>Active Rentals</h3>
              <p className="stat-value">{stats.activeRentals}</p>
            </div>
            <div className="stat-card">
              <h3>Total Hours Rented</h3>
              <p className="stat-value">{stats.totalHours}</p>
            </div>
          </div>

          {listings.length === 0 ? (            <div className="no-listings">
              <h3>You don't have any computers listed yet</h3>
              <p>Share your computing resources and start earning by listing your first computer</p>
              <button 
                className="add-listing-btn"
                onClick={handleAddComputer}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                </svg>
                Add Your First Computer
              </button>
            </div>
          ) : (
            <div className="listings-grid">              {listings.map(listing => (
                <div key={listing.id} className="listing-card">                  <div className="listing-header">
                    <h2>{listing.name}</h2>
                    <div className={`status-badge ${listing.status.toLowerCase().replace(' ', '-')}`}>
                      <span>{listing.status}</span>
                    </div>
                  </div>
    
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        CPU
                      </span>
                      <span className="spec-value">{listing.specs.cpu}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M9 3v10H8V3h1z"/>
                          <path d="M6.5 3a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        RAM
                      </span>
                      <span className="spec-value">{listing.specs.ram}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M14.5 13.5a.5.5 0 0 1-1.064.108l-4.31-10.5a.5.5 0 0 0-.44-.318l-1.672.11a.5.5 0 0 0-.295.226l-4.33 7.157a.5.5 0 0 0-.144.39l1.401 7.191a.5.5 0 0 1-.327.65l-.347.11a.5.5 0 0 1-.645-.35L1.21 9.308a.5.5 0 0 1 .141-.452l5.569-5.569a.5.5 0 0 1 .512-.12l6.807 2.477a.5.5 0 0 1 .261.667zM3.5 13.5a.5.5 0 0 1-1.064.108l-1.51-3.5a.5.5 0 0 1 .173-.656l3.028-1.74a.5.5 0 0 1 .506.033l.895.63a.5.5 0 0 1 .098.756l-2.57 3.661a.5.5 0 0 1-.38.704zm2.325-6.754l.606.606a.5.5 0 0 1 0 .707l-2.76 2.76a.5.5 0 0 1-.707 0l-.606-.606a.5.5 0 0 1 0-.707l2.76-2.76a.5.5 0 0 1 .707 0z"/>
                        </svg>
                        GPU
                      </span>
                      <span className="spec-value">{listing.specs.gpu}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.75 0a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75V2.75a.75.75 0 0 0-.25-.534l-2-1.5a.75.75 0 0 0-.5-.166H4.75zM5 2h3.5v9.5h-5V2.75A.25.25 0 0 1 3.75 2.5H5z"/>
                        </svg>
                        Storage
                      </span>
                      <span className="spec-value">{listing.specs.storage}</span>
                    </div>
                  </div>
    
                  <div className="listing-stats">
                    <div className="stat">
                      <span>Price/hr</span>
                      <span className="price">${listing.price}</span>
                    </div>
                    <div className="stat">
                      <span>Total Earned</span>
                      <span>${listing.totalEarnings.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                      <span>Hours Rented</span>
                      <span>{listing.totalHours}h</span>
                    </div>
                  </div>
    
                  <div className="listing-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(listing.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.354-.146L2.146 10.5a.5.5 0 0 1 0-.707z"/>
                      </svg>
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => initiateDelete(listing.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Computer Listing"
        message="Are you sure you want to delete this computer listing? This action cannot be undone."
      />
    </>
  );
};

export default MyListings;