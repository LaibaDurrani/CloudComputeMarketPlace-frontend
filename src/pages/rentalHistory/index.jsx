import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import './styles.css';

const RentalHistory = () => {
  const { isSidebarOpen } = useSidebar();
  const [activeTab, setActiveTab] = useState('history'); // Add state for active tab

  const renderRentals = () => {
    if (activeTab === 'active') {
      return (
        <div className="rentals-items">
          <div className="rental-item">
            <div className="rental-header">
              <h3>Deep Learning Workstation</h3>
              <span className="status active">Active</span>
            </div>
            <div className="rental-details">
              <p>Date: Monday, May 5, 2025</p>
              <p>Duration: 2 hours</p>
              <button className="connect-btn">Connect Now</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rentals-items">
        <div className="rental-item">
          <div className="rental-header">
            <h3>Gaming PC</h3>
            <span className="status completed">Completed</span>
          </div>
          <div className="rental-details">
            <p>Date: Monday, May 1, 2025</p>
            <p>Duration: 3 hours</p>
            <p className="completion-time">Completed at: 5:00 PM</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="rentals-content">
          <h1>Rental History</h1>
          
          <div className="rental-stats">
            <div className="stat-card">
              <h3>Total Rentals</h3>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-card">
              <h3>Active Rentals</h3>
              <span className="stat-value">2</span>
            </div>
            <div className="stat-card">
              <h3>Completed Rentals</h3>
              <span className="stat-value">10</span>
            </div>
          </div>

          <div className="rentals-list">
            <div className="rental-tabs">
              <button 
                className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active
              </button>
              <button 
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>
            
            {renderRentals()}
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalHistory;