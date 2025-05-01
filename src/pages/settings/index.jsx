import React, { useState, useEffect } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Header from '../../components/Header';
import './styles.css';

const Settings = () => {
  const { isSidebarOpen } = useSidebar();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    notifications: {
      email: true,
      push: true
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type) => {
    setUserData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to update user settings
    setIsEditing(false);
  };

  return (
    <div className={`settings-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      <div className="settings-content">
        <h1>Settings</h1>
        
        <div className="settings-grid">
          <div className="settings-card">
            <h2>Profile Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="button-group">
                {isEditing ? (
                  <>
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="settings-card">
            <h2>Notifications</h2>
            <div className="notification-settings">
              <div className="notification-option">
                <label>
                  <input
                    type="checkbox"
                    checked={userData.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  Email Notifications
                </label>
              </div>
              <div className="notification-option">
                <label>
                  <input
                    type="checkbox"
                    checked={userData.notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  Push Notifications
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;