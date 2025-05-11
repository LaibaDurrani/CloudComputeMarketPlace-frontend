import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { AuthContext } from '../../context/AuthContext';
import { getAllComputers, getUserRentals, getUserComputers } from '../../services/api';
import './styles.css';
import { FaSearch, FaUser, FaDesktop, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const { currentUser } = useContext(AuthContext);
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRentalsCount, setActiveRentalsCount] = useState(0);
  const [userListingsCount, setUserListingsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllComputers();
        setComputers(response.data.data);
        
        // If user is logged in, fetch their rentals and listings
        if (currentUser) {
          try {
            const rentalsResponse = await getUserRentals();
            const activeRentals = rentalsResponse.data.data.filter(
              rental => rental.status === 'active'
            );
            setActiveRentalsCount(activeRentals.length);
          } catch (err) {
            console.error("Error fetching rentals:", err);
          }
          
          // If user is a seller or both, fetch their computer listings
          if (currentUser.profileType === 'seller' || currentUser.profileType === 'both') {
            try {
              const listingsResponse = await getUserComputers();
              setUserListingsCount(listingsResponse.data.data.length);
            } catch (err) {
              console.error("Error fetching user listings:", err);
            }
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching computers:", err);
        setError("Failed to load computers. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  return (
    <>
      <Header />
      <Sidebar />      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-content">
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
          </div>
          <div className="filters-section">
            <div className="filters-header">
              <h3>Available Computers</h3>
              <p className="available-count">{computers.length} machines available</p>
            </div>            <div className="search-filters">
              <div className="search-wrapper">
              <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by specifications..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="filter-select" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="rendering">3D Rendering</option>
                <option value="gaming">Gaming</option>
                <option value="video">Video Editing</option>
                <option value="dev">Software Development</option>
                <option value="scientific">Scientific Computing</option>
                <option value="data">Data Analysis</option>
                <option value="crypto">Crypto Mining</option>
                <option value="cad">CAD/CAM</option>
                <option value="virtualization">Virtualization</option>
              </select>
            </div>5          </div>          {loading ? (
            <div className="loading-state">
              <p>Loading computers...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className="computers-grid">              {computers
                .filter(computer => {
                  // Filter by search term
                  if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    return (
                      computer.title.toLowerCase().includes(searchLower) ||
                      computer.description.toLowerCase().includes(searchLower) ||
                      computer.specs.cpu.toLowerCase().includes(searchLower) ||
                      computer.specs.gpu.toLowerCase().includes(searchLower) ||
                      computer.specs.ram.toLowerCase().includes(searchLower) ||
                      computer.specs.storage.toLowerCase().includes(searchLower) ||
                      computer.location.toLowerCase().includes(searchLower)
                    );
                  }
                  return true;
                })
                .filter(computer => {
                  // Filter by category
                  if (selectedCategory && computer.categories) {
                    return computer.categories.some(
                      category => category.toLowerCase() === selectedCategory.toLowerCase()
                    );
                  }
                  return true;
                })
                .map(computer => (
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
                  </div>
                ))}
              
              {computers.length === 0 && !loading && !error && (
                <div className="no-results">
                  <p>No computers available matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;