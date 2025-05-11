import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './styles.css';

const Header = () => {  const navigate = useNavigate();
  const { setIsSidebarOpen } = useSidebar();
  const { dashboardMode } = useDashboardMode();
  const { currentUser, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = () => {
    console.log("Logging out...");
    logout(); // This will clear user data and navigate to the landing page
  };
  const getNavLinks = () => {
    // No longer showing links in the header for seller mode
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
        <div className="user-menu" ref={dropdownRef}>
          <div 
            className="user-profile"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserCircle className="user-icon" />
          </div>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
