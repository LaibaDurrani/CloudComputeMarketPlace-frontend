import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useDashboardMode } from '../../context/DashboardModeContext';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConversationsManagement from '../../components/ConversationsManagement';
import { updateProfile, updatePassword, deleteAccount, getUserComputers, getUserRentals, getRentedOutComputers } from '../../services/api';
import './styles.css';

const Profile = ({ activeTab = 'profile' }) => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const { dashboardMode, setDashboardMode } = useDashboardMode();
  const { currentUser, logout, setCurrentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    profileType: 'both'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalListings: 0,
    activeRentals: 0,
    totalEarnings: 0,
    totalSpent: 0
  });
    // Fetch user data and stats
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        profilePicture: currentUser.profilePicture || '',
        profileType: currentUser.profileType || 'both'
      });
      
      fetchUserStats();
    }
  }, [currentUser]);
  
  // Fetch user statistics
  const fetchUserStats = async () => {
    setLoading(true);
    try {
      // Get user computers (listings)
      const computersRes = await getUserComputers();
      const computers = computersRes.data.data || [];
      
      // Get user rentals
      const rentalsRes = await getUserRentals();
      const rentals = rentalsRes.data.data || [];
      
      // Get rented out computers
      const rentedOutRes = await getRentedOutComputers();
      const rentedOut = rentedOutRes.data.data || [];
      
      // Calculate statistics
      const activeRentals = rentals.filter(rental => rental.status === 'active').length;
      
      // Calculate earnings from rentals (as owner)
      const totalEarnings = rentedOut.reduce((sum, rental) => {
        return sum + (rental.totalPrice || 0);
      }, 0);
      
      // Calculate spent on rentals (as renter)
      const totalSpent = rentals.reduce((sum, rental) => {
        return sum + (rental.totalPrice || 0);
      }, 0);
      
      setStats({
        totalListings: computers.length,
        activeRentals,
        totalEarnings,
        totalSpent
      });
      
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to load user statistics.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile type selection
  const handleProfileTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      profileType: type
    }));
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await updateProfile(formData);
      
      if (response.data.success) {
        // Update current user in context
        setCurrentUser({
          ...currentUser,
          ...formData
        });
        
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          ...formData
        }));
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setSuccess('Password updated successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };
    // Handle account deletion confirmation
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call API to delete the account
      const response = await deleteAccount();
      
      if (response.data.success) {
        // Log the user out
        logout();
        // Redirect to home page
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.response?.data?.error || 'Failed to delete account.');
      setIsDeleteModalOpen(false);
      setLoading(false);
    }
  };  const [currentTab, setCurrentTab] = useState(activeTab);
  
  // Update tab when activeTab prop changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);
  
  // Navigate to appropriate URL when tab changes
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab === 'profile') {
      navigate('/profile');
    } else if (tab === 'conversations') {
      navigate('/profile/conversations');
    }
  };
  
  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="profile-content">
          <div className="profile-header-tabs">
            <h1>My Profile</h1>
            
            <div className="profile-tabs">
              <button 
                className={`tab-button ${currentTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                Profile Info
              </button>
              <button 
                className={`tab-button ${currentTab === 'conversations' ? 'active' : ''}`}
                onClick={() => handleTabChange('conversations')}
              >
                Conversations
              </button>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <span>{success}</span>
            </div>
          )}
          
          {/* Display different content based on active tab */}
          {currentTab === 'conversations' ? (
            <ConversationsManagement currentUser={currentUser} />
          ) : loading && !currentUser ? (
            <div className="loading-container">
              <LoadingSpinner />
              <p>Loading your profile...</p>
            </div>
          ) : (
            <>
              <div className="profile-grid">
                {/* Profile Summary Card */}
                <section className="profile-summary">
                  <div className="profile-header">
                    <div className="profile-image">
                      {formData.profilePicture ? (
                        <img 
                          src={formData.profilePicture} 
                          alt={`${formData.name}'s profile`} 
                        />
                      ) : (
                        <div className="profile-avatar-placeholder">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      {isEditing && (
                        <div className="image-upload">
                          <label htmlFor="profilePicture">Change Photo</label>
                          <input 
                            type="text" 
                            id="profilePicture"
                            name="profilePicture"
                            placeholder="Enter image URL"
                            value={formData.profilePicture}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                    <div className="profile-info">
                      <h2>{formData.name}</h2>
                      <p className="user-email">{formData.email}</p>
                      <p className="user-role">
                        {formData.profileType === 'buyer' ? 'Renter' : 
                         formData.profileType === 'seller' ? 'Owner' : 'Renter & Owner'}
                      </p>
                      <p className="join-date">
                        Member since {new Date(currentUser?.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <div className="profile-actions">
                      <button className="primary-btn" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </button>
                      <button className="secondary-btn" onClick={() => setIsChangingPassword(true)}>
                        Change Password
                      </button>
                      <button className="danger-btn" onClick={() => setIsDeleteModalOpen(true)}>
                        Delete Account
                      </button>
                    </div>
                  ) : (
                    <div className="edit-actions">
                      <button className="secondary-btn" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </section>
                
                {/* User Stats */}
                <section className="user-stats">
                  <h3>Account Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📋</div>
                      <div className="stat-info">
                        <h4>My Listings</h4>
                        <p className="stat-value">{stats.totalListings}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💻</div>
                      <div className="stat-info">
                        <h4>Active Rentals</h4>
                        <p className="stat-value">{stats.activeRentals}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <h4>Total Earnings</h4>
                        <p className="stat-value">${stats.totalEarnings.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💸</div>
                      <div className="stat-info">
                        <h4>Total Spent</h4>
                        <p className="stat-value">${stats.totalSpent.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </section>
                
                {/* Edit Profile Form */}
                {isEditing && (
                  <section className="edit-profile">
                    <h3>Edit Profile</h3>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                        <small>Email cannot be changed</small>
                      </div>
                      
                      <div className="form-group">
                        <label>Profile Type</label>
                        <div className="radio-group">
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="profileTypeBuyer"
                              name="profileType"
                              checked={formData.profileType === 'buyer'}
                              onChange={() => handleProfileTypeChange('buyer')}
                            />
                            <label htmlFor="profileTypeBuyer">Renter Only</label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="profileTypeSeller"
                              name="profileType"
                              checked={formData.profileType === 'seller'}
                              onChange={() => handleProfileTypeChange('seller')}
                            />
                            <label htmlFor="profileTypeSeller">Owner Only</label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="profileTypeBoth"
                              name="profileType"
                              checked={formData.profileType === 'both'}
                              onChange={() => handleProfileTypeChange('both')}
                            />
                            <label htmlFor="profileTypeBoth">Both</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </section>
                )}
                
                {/* Change Password Form */}
                {isChangingPassword && (
                  <section className="change-password">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordUpdate}>
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsChangingPassword(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </section>
                )}
                  {/* Quick Links */}
                <section className="quick-links">
                  <h3>Quick Links</h3>
                  <ul className="links-list">
                    <li>
                      <button className="link-btn" onClick={() => {
                        setDashboardMode('seller');
                        navigate('/mylistings');
                      }}>
                        <span className="link-icon">📋</span>
                        <span>Manage My Listings</span>
                      </button>
                    </li>
                    <li>
                      <button className="link-btn" onClick={() => {
                        setDashboardMode('buyer');
                        navigate('/rentals');
                      }}>
                        <span className="link-icon">💻</span>
                        <span>View My Rentals</span>
                      </button>
                    </li>                    <li>
                      <button className="link-btn" onClick={() => {
                        setDashboardMode('seller');
                        navigate('/add-computer');
                      }}>
                        <span className="link-icon">➕</span>
                        <span>Add New Computer</span>
                      </button>
                    </li>
                    <li>
                      <button className="link-btn" onClick={() => handleTabChange('conversations')}>
                        <span className="link-icon">💬</span>
                        <span>My Conversations</span>
                      </button>
                    </li>
                  </ul>
                </section>
              </div>
            </>
          )}
          
          {/* Delete Account Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <h2>Delete Account</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="danger-btn" onClick={handleDeleteAccount}>
                    Yes, Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;