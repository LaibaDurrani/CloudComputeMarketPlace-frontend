import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './styles.css';

const ComputerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Add this at the top of component

  return (
    <div className="computer-details">
      <Header />
      <div className="details-content">
        <div className="details-header">
          <div className="header-left">
            <h1>Computer Name</h1>
            <div className="location-info">📍 Location</div>
          </div>
          <div className="header-right">
            <div className="price-tag">Price/hr</div>
            <button 
              className="rent-button" 
              onClick={() => navigate(`/checkout/${id}`)}
            >
              Rent Now
            </button>
          </div>
        </div>

        <div className="details-grid">
          <div className="main-content">
            <div className="image-gallery">
              <div className="main-image">
                <img src="" alt="Computer" />
              </div>
              <div className="thumbnail-strip">
                {/* Thumbnails will go here */}
              </div>
            </div>

            <section className="description-section">
              <h2>About this Computer</h2>
              <p className="description-text"></p>
            </section>

            <section className="specifications-section">
              <h2>Technical Specifications</h2>
              <div className="specs-grid">
                {/* Specs will go here */}
              </div>
            </section>

            <section className="benchmarks-section">
              <h2>Performance Benchmarks</h2>
              <div className="benchmarks-grid">
                {/* Benchmarks will go here */}
              </div>
            </section>
          </div>

          <aside className="sidebar">
            <div className="owner-card">
              <div className="owner-header">
                <img src="" alt="Owner" className="owner-avatar" />
                <div className="owner-info">
                  <h3>Owner Name</h3>
                  <div className="owner-stats">
                    <span>⭐ Rating</span>
                    <span>🔄 Total Rentals</span>
                  </div>
                </div>
              </div>
              <button className="contact-owner">Contact Owner</button>
            </div>

            <div className="availability-card">
              <h3>Availability</h3>
              <div className="availability-status">
                <span className="status-badge">Status</span>
                <span className="next-available">Next Available</span>
              </div>
              <button className="book-now">Book Now</button>
            </div>

            <div className="use-cases-card">
              <h3>Recommended Use Cases</h3>
              <div className="use-cases-list">
                {/* Use cases will go here */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ComputerDetails;