import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

const MyRentals = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [rentals] = useState([
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
      owner: "John Smith",
      startTime: "2024-01-15T10:00:00",
      endTime: "2024-01-15T14:00:00",
      status: "Active",
      totalCost: 34.00
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
      owner: "Jane Doe",
      startTime: "2024-01-14T15:00:00",
      endTime: "2024-01-14T19:00:00",
      status: "Completed",
      totalCost: 19.00
    }
  ]);

  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header />
      {isSidebarOpen && <Sidebar />}
      <div className="dashboard-content">
        <div className="rentals-container">
          <div className="rentals-header">
            <h1>My Rentals</h1>
          </div>

          <div className="stats-overview">
            <div className="stat-card">
              <h3>Active Rentals</h3>
              <p className="stat-value">1</p>
            </div>
            <div className="stat-card">
              <h3>Total Spent</h3>
              <p className="stat-value">$53.00</p>
            </div>
            <div className="stat-card">
              <h3>Total Hours</h3>
              <p className="stat-value">8</p>
            </div>
          </div>

          <div className="rentals-grid">
            {rentals.map(rental => (
              <div key={rental.id} className="rental-card">
                <div className="rental-header">
                  <div className="header-left">
                    <h2>{rental.name}</h2>
                    <span className="owner">by {rental.owner}</span>
                  </div>
                  <span className={`status-badge ${rental.status.toLowerCase()}`}>
                    {rental.status}
                  </span>
                </div>

                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">CPU</span>
                    <span className="spec-value">{rental.specs.cpu}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">RAM</span>
                    <span className="spec-value">{rental.specs.ram}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">GPU</span>
                    <span className="spec-value">{rental.specs.gpu}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Storage</span>
                    <span className="spec-value">{rental.specs.storage}</span>
                  </div>
                </div>

                <div className="rental-details">
                  <div className="detail">
                    <span>Price/hr</span>
                    <span className="price">${rental.price}</span>
                  </div>
                  <div className="detail">
                    <span>Total Cost</span>
                    <span>${rental.totalCost}</span>
                  </div>
                  <div className="detail">
                    <span>Duration</span>
                    <span>4h</span>
                  </div>
                </div>

                <div className="rental-actions">
                  <button className="connect-btn">Connect</button>
                  <button className="extend-btn">Extend Time</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;