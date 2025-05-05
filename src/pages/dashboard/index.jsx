import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';
import { FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [computers] = useState([
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
      owner: "John Doe",
      useCase: ["AI & ML Training", "Data Processing"]
    },
    {
      id: 2,
      name: "Rendering Powerhouse",
      specs: {
        cpu: "Intel Xeon W-3175X",
        ram: "256GB DDR4 ECC",
        gpu: "NVIDIA RTX 4090",
        storage: "8TB RAID Configuration"
      },
      useCase: ["3D Rendering", "Video Editing"],
      price: 6.75,
      location: "San Francisco",
      status: "Available",
      rating: 4.9
    }
  ]);

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-content">
          <div className="filters-section">
            <div className="filters-header">
              <h3>Available Computers</h3>
              <p className="available-count">{computers.length} machines available</p>
            </div>
            <div className="search-filters">
              <div className="search-wrapper">
              <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by specifications..."
                  className="search-input"
                />
              </div>
              <select className="filter-select">
                <option value="">All Categories</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="rendering">3D Rendering</option>
                <option value="gaming">Gaming</option>
                <option value="video">Video Editing</option>
                <option value="dev">Software Development</option>
                <option value="scientific">Scientific Computing</option>
                <option value="data">Data Analysis</option>
                <option value="crypto">Crypto Mining</option>
                <option value="cad">CAD/CAM</option>
                <option value="virtualization">Virtualization</option>
              </select>
            </div>
          </div>
    
          <div className="computers-grid">
            {computers.map(computer => (
              <div key={computer.id} className="computer-card">
                <div className="computer-header">
                  <div className="header-left">
                    <h3>{computer.name}</h3>
                  </div>
                  <span className="price">${computer.price}/hr</span>
                </div>
                
                <div className="specs-list">
                  <div className="spec-item">
                    <span className="spec-label">CPU</span>
                    <span className="spec-value">{computer.specs.cpu}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">RAM</span>
                    <span className="spec-value">{computer.specs.ram}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">GPU</span>
                    <span className="spec-value">{computer.specs.gpu}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Storage</span>
                    <span className="spec-value">{computer.specs.storage}</span>
                  </div>
                </div>
    
                <div className="use-cases">
                  {computer.useCase.map(uc => (
                    <span key={uc} className="use-case-tag">{uc}</span>
                  ))}
                </div>
    
                <div className="card-actions">
                  <button 
                    className="details-btn" 
                    onClick={() => navigate(`/computer/${computer.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;