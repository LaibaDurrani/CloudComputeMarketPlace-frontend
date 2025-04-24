import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useSidebar } from '../../context/SidebarContext';
import './styles.css';

const AddComputer = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [formData, setFormData] = useState({
    name: '',
    cpu: '',
    ram: '',
    gpu: '',
    storage: '',
    price: '',
    useCases: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    navigate('/mylistings');
  };

  return (
    <>
      <Header />
      <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="add-computer-container">
          <h1>List Your Computer</h1>
          <form onSubmit={handleSubmit} className="add-computer-form">
            <div className="form-group">
              <label>Computer Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Deep Learning Workstation"
                required
              />
            </div>

            <div className="specs-section">
              <h2>Specifications</h2>
              <div className="form-group">
                <label>CPU</label>
                <input
                  type="text"
                  value={formData.cpu}
                  onChange={(e) => setFormData({...formData, cpu: e.target.value})}
                  placeholder="e.g., AMD Threadripper 3990X"
                  required
                />
              </div>
              <div className="form-group">
                <label>RAM</label>
                <input
                  type="text"
                  value={formData.ram}
                  onChange={(e) => setFormData({...formData, ram: e.target.value})}
                  placeholder="e.g., 128GB DDR4"
                  required
                />
              </div>
              <div className="form-group">
                <label>GPU</label>
                <input
                  type="text"
                  value={formData.gpu}
                  onChange={(e) => setFormData({...formData, gpu: e.target.value})}
                  placeholder="e.g., NVIDIA RTX 4090"
                  required
                />
              </div>
              <div className="form-group">
                <label>Storage</label>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) => setFormData({...formData, storage: e.target.value})}
                  placeholder="e.g., 2TB NVMe SSD"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Price per Hour ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/mylistings')}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                List Computer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddComputer;