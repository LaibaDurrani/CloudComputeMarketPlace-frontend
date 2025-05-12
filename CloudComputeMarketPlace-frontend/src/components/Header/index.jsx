import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { useNotifications } from '../../context/NotificationsContext';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaEnvelope } from 'react-icons/fa';
import './styles.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSidebarOpen } = useSidebar();
  const { dashboardMode } = useDashboardMode();
  const { currentUser, logout } = useContext(AuthContext);
  const { unreadMessageCount } = useNotifications();
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
        </button>        <div className="title-group">
          <div className="nimbus-logo">
            <span>N</span>
            <span>i</span>
            <span>m</span>
            <span>b</span>
            <span>u</span>
            <span>s</span>
          </div>
        </div>
      </div>

      <nav className="header-nav">
        {getNavLinks()}      </nav>
      <div className="header-actions">
        {currentUser && (
          <div 
            className="messages-icon-container" 
            onClick={() => navigate('/profile/conversations')}
            title="View conversations"
          >
            <FaEnvelope className="messages-icon" />
            {unreadMessageCount > 0 && (
              <div className="unread-badge">{unreadMessageCount > 99 ? '99+' : unreadMessageCount}</div>
            )}
          </div>
        )}
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
