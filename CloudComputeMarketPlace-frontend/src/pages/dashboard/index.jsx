import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import { AuthContext } from '../../context/AuthContext';
import { getAllComputers, getUserRentals, getUserComputers } from '../../services/api';
import './styles.css';
import { FaSearch, FaUser, FaDesktop, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRentalsCount, setActiveRentalsCount] = useState(0);
  const [userListingsCount, setUserListingsCount] = useState(0);  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(30);
  const [totalItems, setTotalItems] = useState(0);
    // We don't need to filter computers locally anymore since we're using backend filtering
  const filteredComputers = computers;
  // Function to fetch computers based on filters and pagination
  const fetchComputers = async () => {
    try {
      setLoading(true);
      const response = await getAllComputers(
        currentPage, 
        itemsPerPage, 
        searchTerm, 
        selectedCategory
      );
      
      setComputers(response.data.data);
      setTotalPages(response.data.pagination.total);
      setTotalItems(response.data.pagination.totalItems);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching computers:", err);
      setError("Failed to load computers. Please try again later.");
      setLoading(false);
    }
  };
  
  // Fetch user data separately from computers
  const fetchUserData = async () => {
    if (currentUser) {
      try {
        const rentalsResponse = await getUserRentals();
        const activeRentals = rentalsResponse.data.data.filter(
          rental => rental.status === 'active'
        );
        setActiveRentalsCount(activeRentals.length);
        
        // If user is a seller or both, fetch their computer listings
        if (currentUser.profileType === 'seller' || currentUser.profileType === 'both') {
          const listingsResponse = await getUserComputers();
          setUserListingsCount(listingsResponse.data.data.length);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Effect to fetch computers when filters or pagination changes
  useEffect(() => {
    fetchComputers();
  }, [currentPage, searchTerm, selectedCategory]);
  
  // Effect to fetch user data when user changes
  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  return (
    <>
      <Header />      <Sidebar />
      <PageContainer>
        <div className="dashboard-content">
          <div className="nimbus-logo-container">
            <div className="nimbus-logo">
              <span>N</span>
              <span>i</span>
              <span>m</span>
              <span>b</span>
              <span>u</span>
              <span>s</span>
            </div>
            <div className="nimbus-tagline">Cloud Computing Marketplace</div>
          </div>
          <div className="welcome-section">
            <div className="welcome-message">
              <h2>Welcome back, {currentUser?.name || 'User'}!</h2>
              <p>Here's what's happening with your Cloud Compute Marketplace account today.</p>
            </div>          <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon"><FaDesktop /></div>
                <div className="stat-info">
                  <h3>Available Computers</h3>
                  <p className="stat-number">{loading ? "..." : computers.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaClock /></div>
                <div className="stat-info">
                  <h3>Active Rentals</h3>
                  <p className="stat-number">{loading ? "..." : activeRentalsCount}</p>
                </div>
              </div>
              {currentUser?.profileType === 'seller' || currentUser?.profileType === 'both' ? (
                <div className="stat-card">
                  <div className="stat-icon"><FaUser /></div>
                  <div className="stat-info">
                    <h3>Your Listings</h3>
                    <p className="stat-number">{loading ? "..." : userListingsCount}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>          <div className="filters-section">            <div className="filters-header">
              <h3>Available Computers</h3>              <p className="available-count">
                {totalItems} machines available
              </p>
            </div><div className="search-filters">
              <div className="search-wrapper">
              <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by specifications..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
              <select 
                className="filter-select" 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1); // Reset to first page on category change
                }}
              ><option value="">All Categories</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="3D Rendering">3D Rendering</option>
                <option value="Gaming">Gaming</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Software Development">Software Development</option>
                <option value="Scientific Computing">Scientific Computing</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Crypto Mining">Crypto Mining</option>
                <option value="CAD/CAM">CAD/CAM</option>
                <option value="Virtualization">Virtualization</option></select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <p>Loading computers...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>          ) : (
            <div className="computers-grid">              {filteredComputers.length === 0 ? (
                <div className="no-results">
                  <p>No computers found matching your search criteria.</p>
                </div>
              ) : (
                filteredComputers.map(computer => (
                  <div key={computer._id} className="computer-card">
                    <div className="computer-header">
                      <div className="header-left">
                        <h3>{computer.title}</h3>
                      </div>
                      <span className="price">${computer.price.hourly}/hr</span>
                    </div>
                    
                    <div className="specs-list">
                      <div className="spec-item">
                        <span className="spec-label">CPU</span>
                        <span className="spec-value">{computer.specs.cpu}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">RAM</span>
                        <span className="spec-value">{computer.specs.ram}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">GPU</span>
                        <span className="spec-value">{computer.specs.gpu}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Storage</span>
                        <span className="spec-value">{computer.specs.storage}</span>
                      </div>
                    </div>
      
                    <div className="use-cases">
                      {computer.categories && computer.categories.map(category => (
                        <span key={category} className="use-case-tag">{category}</span>
                      ))}
                      {!computer.categories && (
                        <span className="use-case-tag">General Computing</span>
                      )}
                    </div>
      
                    <div className="card-actions">
                      <button 
                        className="details-btn" 
                        onClick={() => navigate(`/computer/${computer._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>                ))
              )}            </div>
          )}
            {/* Pagination Controls */}
          {totalPages > 1 && !loading && !error && (
            <div className="pagination-controls">
              <button 
                className="pagination-button" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft /> Prev
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default Dashboard;