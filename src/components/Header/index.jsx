import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const Header = () => {
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useSidebar();
  const { dashboardMode } = useDashboardMode();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getNavLinks = () => {
    if (dashboardMode === 'seller') {
      return (
        <>
          <Link to="/mylistings">My Listings</Link>
          <Link to="/add-computer">Add Computer</Link>
          <Link to="/profile">User</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/dashboard">Browse</Link>
        <Link to="/rentals">My Rentals</Link>
        <Link to="/profile">User</Link>
      </>
    );
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="hamburger-menu"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="title-group">
          <h1>CloudCompute Marketplace</h1>
        </div>
      </div>
      
      <nav className="header-nav">
        {getNavLinks()}
      </nav>

      <div className="header-actions">
        {/* ... rest of your header code ... */}
      </div>
    </header>
  );
};

export default Header;