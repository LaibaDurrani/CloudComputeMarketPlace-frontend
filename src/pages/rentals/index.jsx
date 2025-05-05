import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import './styles.css';

const MyRentals = () => {
  const { isSidebarOpen } = useSidebar();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    const iframe = document.getElementById('screenShare');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen();
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="rentals-content">
          <h1>My Rentals</h1>
          
          <div className="rentals-grid">
            <section className="screen-share-section">
              <div className="iframe-container">
                <iframe
                  id="screenShare"
                  src="YOUR_SCREEN_SHARE_APP_URL"
                  title="Screen Share"
                  allow="fullscreen"
                />
                <button 
                  className="fullscreen-btn"
                  onClick={handleFullScreen}
                >
                  {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                </button>
              </div>
            </section>

            <section className="rentals-list">
              <h2>Active Rentals</h2>
              <div className="rentals-items">
                {/* Example rental item */}
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
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRentals;