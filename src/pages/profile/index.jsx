import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Header from '../../components/Header';
import './styles.css';

const Profile = () => {
  const { isSidebarOpen } = useSidebar();
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2024",
    profileImage: "https://placehold.co/150", // Updated placeholder URL
    stats: {
      totalListings: 2,
      activeRentals: 1,
      totalEarnings: 568.00,
      totalSpent: 122.00
    }
  });

  return (
    <div className={`profile-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="profile-content">
        <Header />
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-image">
              <img src={userData.profileImage} alt="Profile" />
            </div>
            <div className="profile-info">
              <h1>{userData.name}</h1>
              <p className="email">{userData.email}</p>
              <p className="join-date">Member since {userData.joinDate}</p>
            </div>
          </div>
  
          <div className="stats-grid">
            <div className="stat-card">
              <h3>My Listings</h3>
              <p className="stat-value">{userData.stats.totalListings}</p>
            </div>
            <div className="stat-card">
              <h3>Active Rentals</h3>
              <p className="stat-value">{userData.stats.activeRentals}</p>
            </div>
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">${userData.stats.totalEarnings}</p>
            </div>
            <div className="stat-card">
              <h3>Total Spent</h3>
              <p className="stat-value">${userData.stats.totalSpent}</p>
            </div>
          </div>
  
          <div className="profile-sections">
            <div className="section">
              <h2>Account Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" defaultValue={userData.name} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={userData.email} />
                </div>
                <button className="save-btn">Save Changes</button>
              </div>
            </div>
  
            <div className="section">
              <h2>Security</h2>
              <div className="security-options">
                <button className="change-password-btn">Change Password</button>
                <button className="enable-2fa-btn">Enable 2FA</button>
              </div>
            </div>
  
            <div className="section">
              <h2>Payment Information</h2>
              <div className="payment-info">
                <button className="add-payment-btn">Add Payment Method</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
};

export default Profile;