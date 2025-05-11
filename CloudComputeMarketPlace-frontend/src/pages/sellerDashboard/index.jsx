import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserComputers, getUserRentals, getRentedOutComputers } from '../../services/api';
import './styles.css';

const SellerDashboard = () => {
  const { isSidebarOpen } = useSidebar();
  const [computers, setComputers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    listings: 0,
    earnings: 0,
    activeRentals: 0,
    pendingRequests: 0,
    recentActivity: []
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        
        // Fetch the user's computers (listings)
        const computersResponse = await getUserComputers();
        const userComputers = computersResponse.data.data;
        setComputers(userComputers);
        
        // Fetch rentals of user's computers
        const rentedOutResponse = await getRentedOutComputers();
        const userRentals = rentedOutResponse.data.data;
        setRentals(userRentals);
        
        // Calculate stats
        const activeRentals = userRentals.filter(rental => rental.status === 'active').length;
        const pendingRequests = userRentals.filter(rental => rental.status === 'pending').length;
        
        // Calculate total earnings
        const totalEarnings = userRentals
          .filter(rental => rental.status === 'completed')
          .reduce((sum, rental) => sum + rental.totalPrice, 0);
        
        // Get recent activity (latest 5 rentals)
        const sortedActivity = [...userRentals].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        
        setStats({
          listings: userComputers.length,
          earnings: totalEarnings.toFixed(2),
          activeRentals,
          pendingRequests,
          recentActivity: sortedActivity
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching seller data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchSellerData();
  }, []);

  if (loading) {
    return (
      <div className="seller-dashboard">
        <Header />
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-dashboard">
        <Header />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

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
            <div className="stat-value">{stats.listings}</div>
          </div>
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <div className="stat-value">${stats.earnings}</div>
          </div>
          <div className="stat-card">
            <h3>Active Rentals</h3>
            <div className="stat-value">{stats.activeRentals}</div>
          </div>
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <div className="stat-value">{stats.pendingRequests}</div>
          </div>
        </div>        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats.recentActivity.length === 0 ? (
              <p className="no-activity">No recent activity</p>
            ) : (
              stats.recentActivity.map(activity => {
                // Find the computer associated with this rental
                const computer = computers.find(c => c._id === activity.computer);
                const computerName = computer ? computer.title : 'Unknown Computer';
                
                // Format the date
                const date = new Date(activity.createdAt);
                const now = new Date();
                const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
                
                let timeAgo;
                if (diffInHours < 1) {
                  timeAgo = 'Just now';
                } else if (diffInHours < 24) {
                  timeAgo = `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
                } else {
                  const diffInDays = Math.floor(diffInHours / 24);
                  timeAgo = diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
                }
                
                // Determine icon and message based on status
                let icon, message;
                
                if (activity.status === 'pending') {
                  icon = '🔵';
                  message = 'New Rental Request';
                } else if (activity.status === 'active') {
                  icon = '🟠';
                  message = 'Rental Activated';
                } else if (activity.status === 'completed') {
                  icon = '🟢';
                  message = 'Payment Received';
                } else if (activity.status === 'cancelled') {
                  icon = '🔴';
                  message = 'Rental Cancelled';
                }
                
                return (
                  <div className="activity-item" key={activity._id}>
                    <div className="activity-icon">{icon}</div>
                    <div className="activity-details">
                      <h4>{message}</h4>
                      <p>{computerName} - {timeAgo}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;