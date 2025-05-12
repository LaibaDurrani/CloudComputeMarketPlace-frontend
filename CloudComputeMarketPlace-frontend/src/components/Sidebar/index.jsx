import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { FaHome, FaList, FaShoppingCart, FaCog, FaChartBar, FaPlus, FaHistory } from 'react-icons/fa';
import '../../App.css';  
import './styles.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();
  const { dashboardMode, setDashboardMode } = useDashboardMode();
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

  const currentMenuItems = dashboardMode === 'buyer' ? buyerMenuItems : sellerMenuItems;  // Add keyboard navigation for menu items
  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

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
                Seller Mode
              </button>
            </div>
          </div>          <div className="sidebar-menu">
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
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="quick-stats">
            <h3>{dashboardMode === 'buyer' ? 'My Rentals' : 'My Listings'}</h3>
            <div className="stat-value">
              {dashboardMode === 'buyer' ? '2 Active' : '3 Listed'}
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-overlay" />
    </>
  );
};

export default Sidebar;