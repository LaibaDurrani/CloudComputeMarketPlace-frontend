import React from 'react';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

const SellerDashboard = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className={`seller-dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Seller Dashboard</h1>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Listings</h3>
            <div className="stat-value">5</div>
          </div>
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <div className="stat-value">$1,250</div>
          </div>
          <div className="stat-card">
            <h3>Active Rentals</h3>
            <div className="stat-value">3</div>
          </div>
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <div className="stat-value">2</div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🔵</div>
              <div className="activity-details">
                <h4>New Rental Request</h4>
                <p>Deep Learning Workstation - 2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🟢</div>
              <div className="activity-details">
                <h4>Payment Received</h4>
                <p>Gaming PC - Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;