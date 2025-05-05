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

  const handleLogout = () => {
    // Add logout logic here (e.g., clear tokens, call logout API, etc.)
    console.log("Logging out...");
    navigate('/login');
  };

  const getNavLinks = () => {
    if (dashboardMode === 'seller') {
      return (
        <>
          <Link to="/mylistings">My Listings</Link>
          <Link to="/add-computer">Add Computer</Link>
        </>
      );
    }
    return null;
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
          <h1>Logo</h1>
        </div>
      </div>

      <nav className="header-nav">
        {getNavLinks()}
      </nav>

      <div className="header-actions">
        <div
          className="user-menu"
          onClick={() => setIsUserMenuOpen(prev => !prev)}
        >
          <span className="user-label">User ▾</span>
          {isUserMenuOpen && (
            <div className="dropdown">
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
