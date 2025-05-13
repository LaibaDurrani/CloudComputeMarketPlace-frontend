import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { useStats } from '../../context/StatsContext';
import { FaHome, FaList, FaShoppingCart, FaCog, FaChartBar, FaPlus, FaHistory } from 'react-icons/fa';
import { getUserRentals, getUserComputers } from '../../services/api';
import '../../App.css';  
import './styles.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();
  const { dashboardMode, setDashboardMode } = useDashboardMode();
  const { statsVersion } = useStats();
  const [activeRentals, setActiveRentals] = useState(0);
  const [listedComputers, setListedComputers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const buyerMenuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaShoppingCart />, label: 'My Rentals', path: '/rentals' },
    { icon: <FaHistory />, label: 'Rental History', path: '/rental-history' },
    { icon: <FaCog />, label: 'Settings', path: '/profile' }
  ];
  const sellerMenuItems = [
    { icon: <FaChartBar />, label: 'Seller Dashboard', path: '/seller-dashboard' },
    { icon: <FaList />, label: 'My Listings', path: '/mylistings' }, // Fixed path to match route
    { icon: <FaPlus />, label: 'Add Computer', path: '/add-computer' },
    { icon: <FaHistory />, label: 'Rental Requests', path: '/rental-history' }, // Using existing route for now
    { icon: <FaCog />, label: 'Settings', path: '/profile' } // Changed to profile page
  ];
  const currentMenuItems = dashboardMode === 'buyer' ? buyerMenuItems : sellerMenuItems;  
  
  // Add keyboard navigation for menu items  
  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };
  
  // Fetch user's rentals and computers when dashboard mode changes or statsVersion updates
  useEffect(() => {
    const fetchQuickStats = async () => {
      setIsLoading(true);
      try {
        if (dashboardMode === 'buyer') {
          const response = await getUserRentals();
          // Count only active rentals
          const active = response.data.data.filter(rental => rental.status === 'active').length;
          setActiveRentals(active);
        } else {
          const response = await getUserComputers();
          setListedComputers(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching quick stats:', error);
        // Set to 0 on error to avoid displaying stale data
        if (dashboardMode === 'buyer') {
          setActiveRentals(0);
        } else {
          setListedComputers(0);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuickStats();
  }, [dashboardMode, statsVersion]);

  return (
    <>
      <div 
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`} 
        tabIndex={isSidebarOpen ? 0 : -1}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <div className="nimbus-logo">
              <span>N</span>
              <span>i</span>
              <span>m</span>
              <span>b</span>
              <span>u</span>
              <span>s</span>
            </div>
          </div>
          <div className="dashboard-switch">
            <div className="switch-buttons">
              <button 
                className={`switch-btn ${dashboardMode === 'buyer' ? 'active' : ''}`}
                onClick={() => {
                  setDashboardMode('buyer');
                  navigate('/dashboard');
                }}
              >
                Buyer Mode
              </button>
              <button 
                className={`switch-btn ${dashboardMode === 'seller' ? 'active' : ''}`}
                onClick={() => {
                  setDashboardMode('seller');
                  navigate('/seller-dashboard');
                }}
              >
                Seller Mode              </button>
            </div>
          </div>
          
          <div className="sidebar-menu">
            {currentMenuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                onKeyDown={(e) => handleKeyDown(e, item.path)}
                tabIndex={isSidebarOpen ? 0 : -1}
                role="menuitem"
                aria-label={item.label}
              >                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </a>
            ))}
          </div>
          
          <div className="quick-stats">
            <h3>{dashboardMode === 'buyer' ? 'My Rentals' : 'My Listings'}</h3>
            <div className="stat-value">
              {isLoading ? (
                <span className="loading-stats">Loading...</span>
              ) : (
                dashboardMode === 'buyer' 
                  ? `${activeRentals} Active` 
                  : `${listedComputers} Listed`
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-overlay" />
    </>
  );
};

export default Sidebar;