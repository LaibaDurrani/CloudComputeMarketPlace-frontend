import React from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './styles.css';

const Header = () => {
  const navigate = useNavigate();
  const { setIsSidebarOpen } = useSidebar();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
          <span className="subtitle">Find Computing Power on Demand</span>
        </div>
      </div>
      
      <nav className="header-nav">
        <Link to="/dashboard">Browse</Link>
        <Link to="/rentals">My Rentals</Link>
        <Link to="/profile">User</Link>
      </nav>

      <div className="header-actions">
        {/* ... rest of your header code ... */}
      </div>
    </header>
  );
};

export default Header;