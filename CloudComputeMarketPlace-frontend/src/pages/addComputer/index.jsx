import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createComputer, getComputer, updateComputer } from '../../services/api';
import './styles.css';

const AddComputer = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the computer ID from URL if in edit mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: {
      hourly: '',
    },
    specs: {
      cpu: '',
      ram: '',
      gpu: '',
      storage: '',
      operatingSystem: '',
    },
    location: '',
    categories: [],    availability: {
      status: 'available',
      activePeriods: [
        {
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0, 16)
        }
      ]
    }
  });

  // Check if we're in edit mode and fetch computer data if needed
  useEffect(() => {
    const fetchComputerData = async () => {
      if (id) {
        try {
          setLoading(true);
          setIsEditMode(true);
          const response = await getComputer(id);          const computerData = response.data.data;
          // Format dates for the form inputs and ensure categories exists          
          const formattedComputerData = {
            ...computerData,
            categories: computerData.categories || [], // Ensure categories is always an array
            availability: {
              ...computerData.availability,
              activePeriods: computerData.availability.activePeriods.map(period => ({
                startDate: period.startDate ? new Date(period.startDate).toISOString().slice(0, 16) : '',
                endDate: period.endDate ? new Date(period.endDate).toISOString().slice(0, 16) : ''
              }))
            }
          };
          
          setFormData(formattedComputerData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching computer data:', err);
          setError('Failed to load computer data. Please try again.');
          setLoading(false);
        }
      }
    };
    
    fetchComputerData();
  }, [id]);
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    // Ensure categories is always an array
    const currentCategories = formData.categories || [];

    if (checked) {
      setFormData({
        ...formData,
        categories: [...currentCategories, value]
      });
    } else {
      setFormData({
        ...formData,
        categories: currentCategories.filter(category => category !== value)
      });
    }
  };  // Handle adding more availability periods
  const addAvailabilityPeriod = () => {
    // Get current date and time in ISO format (YYYY-MM-DDThh:mm)
    const today = new Date().toISOString().slice(0, 16);
    // Default end date is one day later
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 16);

    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        activePeriods: [
          ...formData.availability.activePeriods,
          { startDate: today, endDate: tomorrowStr }
        ]
      }
    });
  };

  // Handle removing an availability period
  const removeAvailabilityPeriod = (index) => {
    const updatedPeriods = [...formData.availability.activePeriods];
    updatedPeriods.splice(index, 1);
    
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        activePeriods: updatedPeriods
      }
    });
  };

  // Handle changes to availability period dates
  const handleAvailabilityChange = (index, field, value) => {
    const updatedPeriods = [...formData.availability.activePeriods];
    updatedPeriods[index][field] = value;
    
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        activePeriods: updatedPeriods
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure categories is an array with at least one value
      if (!formData.categories || formData.categories.length === 0) {
        setError('Please select at least one category');
        setLoading(false);
        return;
      }
      
      // Format the data for the API
      const hourlyPrice = parseFloat(formData.price.hourly);
      if (isNaN(hourlyPrice) || hourlyPrice <= 0) {
        setError('Please enter a valid hourly price');
        setLoading(false);
        return;
      }
      
      const computerData = {
        ...formData,
        price: {
          hourly: hourlyPrice,
          // Calculate discounted prices
          daily: hourlyPrice * 20, // 20 hours price for a day (discount)
          weekly: hourlyPrice * 20 * 6, // 6 days price for a week (discount)
          monthly: hourlyPrice * 20 * 6 * 3.5, // 3.5 weeks for a month (discount)
        },
        // Format availability data - convert string dates to Date objects
        availability: {
          ...formData.availability,
          activePeriods: formData.availability.activePeriods.map(period => ({
            startDate: new Date(period.startDate),
            endDate: new Date(period.endDate)
          }))
        },
        // Ensure categories is explicitly set and is an array
        categories: Array.isArray(formData.categories) ? formData.categories : []
      };
      
      // Validate that we have at least one valid availability period
      const hasValidPeriods = computerData.availability.activePeriods.every(
        period => period.startDate && period.endDate
      );
      
      if (!hasValidPeriods) {
        setError('Please provide valid availability periods');
        setLoading(false);
        return;
      }
      
      // If we're in edit mode, update the computer, otherwise create a new one
      if (isEditMode && id) {
        await updateComputer(id, computerData);
      } else {
        await createComputer(computerData);
      }
      
      navigate('/mylistings');    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} computer listing:`, err);
      console.error('Error response:', err.response?.data);
      
      // Show more detailed error information
      const errorMessage = err.response?.data?.error || 
                          (err.response?.data?.errors && JSON.stringify(err.response.data.errors)) ||
                          `Failed to ${isEditMode ? 'update' : 'create'} listing. Please try again.`;
      
      setError(errorMessage);
      setLoading(false);
    }
  };  
  
  // If we're in edit mode and still loading data, show a loading spinner
  if (isEditMode && loading && !formData.title) {
    return (
      <>
        <Header />
        <Sidebar />
        <PageContainer>
          <div className="add-computer-container">
            <div className="form-header">
              <h1>Loading Computer Data</h1>
              <p>Please wait while we fetch your computer listing details...</p>
            </div>
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          </div>
        </PageContainer>
      </>
    );
  }
  return (
    <>
      <Header />
      <Sidebar />
      <PageContainer>
        <div className="add-computer-container">
          <div className="form-header">
            <h1>{isEditMode ? 'Edit Your Computer Listing' : 'List Your Computer'}</h1>
            <p>
              {isEditMode 
                ? 'Update the details of your computer listing below to keep your information accurate and up-to-date.'
                : 'Fill in the details below to create a new listing for your computer. The more information you provide, the more likely renters will be interested in your machine.'}
            </p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="add-computer-form">          <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label htmlFor="title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687z"/>
                  </svg>
                  Computer Name
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Deep Learning Workstation"
                  required
                />
                <span className="input-hint">Choose a name that highlights your computer's key features</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                    <path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
                  </svg>
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your computer and what it's best suited for..."
                  rows="4"
                  required
                />
                <span className="input-hint">Provide details about performance, special features, and ideal use cases</span>
              </div>
            </div>            <div className="form-section specs-section">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                  <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0h-13Zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5ZM12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1ZM1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25Z"/>
                </svg>
                Specifications
              </h2>
              <p className="section-description">Provide detailed hardware specifications to help renters find the right machine for their needs</p>
              
              <div className="specs-grid">
                <div className="form-group">
                  <label htmlFor="cpu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                      <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                    </svg>
                    CPU
                  </label>
                  <input
                    id="cpu"
                    type="text"
                    value={formData.specs.cpu}
                    onChange={(e) => setFormData({
                      ...formData, 
                      specs: {...formData.specs, cpu: e.target.value}
                    })}
                    placeholder="e.g., AMD Threadripper 3990X"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                      <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                    </svg>
                    RAM
                  </label>
                  <input
                    id="ram"
                    type="text"
                    value={formData.specs.ram}
                    onChange={(e) => setFormData({
                      ...formData, 
                      specs: {...formData.specs, ram: e.target.value}
                    })}
                    placeholder="e.g., 128GB DDR4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gpu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                      <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0h-13Zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5ZM12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1ZM1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25Z"/>
                    </svg>
                    GPU
                  </label>
                  <input
                    id="gpu"
                    type="text"
                    value={formData.specs.gpu}
                    onChange={(e) => setFormData({
                      ...formData, 
                      specs: {...formData.specs, gpu: e.target.value}
                    })}
                    placeholder="e.g., NVIDIA RTX 4090"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="storage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                      <path d="M4.75 0a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75V2.75a.75.75 0 0 0-.25-.534l-2-1.5a.75.75 0 0 0-.5-.166H4.75zM5 2h3.5v9.5h-5V2.75A.25.25 0 0 1 3.75 2.5H5z"/>
                      <path d="M6.75 1a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75V4.75a.75.75 0 0 0-.25-.534l-2-1.5a.75.75 0 0 0-.5-.166h-4.5z"/>
                    </svg>
                    Storage
                  </label>
                  <input
                    id="storage"
                    type="text"
                    value={formData.specs.storage}
                    onChange={(e) => setFormData({
                      ...formData, 
                      specs: {...formData.specs, storage: e.target.value}
                    })}
                    placeholder="e.g., 2TB NVMe SSD"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="os">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '6px'}}>
                      <path d="M11.5 1a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2H3v10.5a.5.5 0 0 1-1 0V1.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .354.146l4 4a.5.5 0 0 1 .146.354v10.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h8.793L11.5 1Z"/>
                    </svg>
                    Operating System
                  </label>
                  <input
                    id="os"
                    type="text"
                    value={formData.specs.operatingSystem}
                    onChange={(e) => setFormData({
                      ...formData, 
                      specs: {...formData.specs, operatingSystem: e.target.value}
                    })}
                    placeholder="e.g., Windows 11 Pro"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Pricing & Location</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price per Hour ($)</label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price.hourly}
                    onChange={(e) => setFormData({
                      ...formData, 
                      price: {
                        ...formData.price, 
                        hourly: e.target.value
                      }
                    })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                  <p className="helper-text">Daily, weekly, and monthly rates will be calculated automatically with discounts.</p>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section availability-section">
              <h2>Availability Periods</h2>
              <p className="section-description">Specify when your computer will be available for rental</p>
              
              {formData.availability.activePeriods.map((period, index) => (
                <div key={index} className="availability-period">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`startDate-${index}`}>Start Date & Time</label>
                      <input
                        id={`startDate-${index}`}
                        type="datetime-local"
                        value={period.startDate}
                        onChange={(e) => handleAvailabilityChange(index, 'startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`endDate-${index}`}>End Date & Time</label>
                      <input
                        id={`endDate-${index}`}
                        type="datetime-local"
                        value={period.endDate}
                        onChange={(e) => handleAvailabilityChange(index, 'endDate', e.target.value)}
                        required
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-period-btn"
                        onClick={() => removeAvailabilityPeriod(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="add-period-btn"
                onClick={addAvailabilityPeriod}
              >
                + Add Another Period
              </button>
            </div>
            
            <div className="form-section categories-section">
              <h2>Categories</h2>
              <p className="section-description">Select all categories that apply to your computer:</p>
              <div className="categories-grid">
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="ai" 
                    value="ai"
                    checked={formData.categories?.includes('ai') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="ai">AI & Machine Learning</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="rendering" 
                    value="rendering"
                    checked={formData.categories?.includes('rendering') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="rendering">3D Rendering</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="gaming" 
                    value="gaming"
                    checked={formData.categories?.includes('gaming') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="gaming">Gaming</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="video" 
                    value="video"
                    checked={formData.categories?.includes('video') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="video">Video Editing</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="dev" 
                    value="dev"
                    checked={formData.categories?.includes('dev') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="dev">Software Development</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="scientific" 
                    value="scientific"
                    checked={formData.categories?.includes('scientific') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="scientific">Scientific Computing</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="data" 
                    value="data"
                    checked={formData.categories?.includes('data') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="data">Data Analysis</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="crypto" 
                    value="crypto"
                    checked={formData.categories?.includes('crypto') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="crypto">Crypto Mining</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="cad" 
                    value="cad"
                    checked={formData.categories?.includes('cad') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="cad">CAD/CAM</label>
                </div>
                <div className="category-option">                  <input 
                    type="checkbox" 
                    id="virtualization" 
                    value="virtualization"
                    checked={formData.categories?.includes('virtualization') || false}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="virtualization">Virtualization</label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => navigate('/mylistings')}
                disabled={loading}
              >
                Cancel
              </button>              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update Computer' : 'List Computer')
                }
              </button>
            </div>          </form>
        </div>
      </PageContainer>
    </>
  );
};

export default AddComputer;