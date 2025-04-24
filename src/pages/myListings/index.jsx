import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

const MyListings = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [listings] = useState([
    {
      id: 1,
      name: "Deep Learning Workstation",
      specs: {
        cpu: "AMD Threadripper 3990X",
        ram: "128GB DDR4",
        gpu: "2x NVIDIA A100",
        storage: "4TB NVMe SSD"
      },
      price: 8.50,
      status: "Available",
      totalEarnings: 425.50,
      totalHours: 50,
      activeRentals: 0
    },
    {
      id: 2,
      name: "Gaming Rig",
      specs: {
        cpu: "Intel i9-13900K",
        ram: "64GB DDR5",
        gpu: "NVIDIA RTX 4080",
        storage: "2TB NVMe SSD"
      },
      price: 4.75,
      status: "In Use",
      totalEarnings: 142.50,
      totalHours: 30,
      activeRentals: 1
    }
  ]);

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="listings-container">
          <div className="listings-header">
            <h1>My Listed Computers</h1>
            <button 
              className="add-listing-btn"
              onClick={() => navigate('/add-computer')} 
            >
              + Add New Computer
            </button>
          </div>

          <div className="stats-overview">
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">$568.00</p>
            </div>
            <div className="stat-card">
              <h3>Active Rentals</h3>
              <p className="stat-value">1</p>
            </div>
            <div className="stat-card">
              <h3>Total Hours Rented</h3>
              <p className="stat-value">80</p>
            </div>
          </div>

          <div className="listings-grid">
            {listings.map(listing => (
              <div key={listing.id} className="listing-card">
                <div className="listing-header">
                  <h2>{listing.name}</h2>
                  <span className={`status-badge ${listing.status.toLowerCase()}`}>
                    {listing.status}
                  </span>
                </div>
  
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">CPU</span>
                    <span className="spec-value">{listing.specs.cpu}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">RAM</span>
                    <span className="spec-value">{listing.specs.ram}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">GPU</span>
                    <span className="spec-value">{listing.specs.gpu}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Storage</span>
                    <span className="spec-value">{listing.specs.storage}</span>
                  </div>
                </div>
  
                <div className="listing-stats">
                  <div className="stat">
                    <span>Price/hr</span>
                    <span className="price">${listing.price}</span>
                  </div>
                  <div className="stat">
                    <span>Total Earned</span>
                    <span>${listing.totalEarnings}</span>
                  </div>
                  <div className="stat">
                    <span>Hours Rented</span>
                    <span>{listing.totalHours}h</span>
                  </div>
                </div>
  
                <div className="listing-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListings;