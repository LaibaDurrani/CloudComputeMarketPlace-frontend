import React, { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import { useSidebar } from '../../context/SidebarContext';

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/mylistings" className={location.pathname === '/mylistings' ? 'active' : ''}>
          My Listings
        </Link>
        <Link to="/rentals" className={location.pathname === '/rentals' ? 'active' : ''}>
          My Rentals
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;