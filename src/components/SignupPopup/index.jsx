import React, { useState } from 'react';
import './styles.css';

const SignupPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  const handleGoogleSignup = () => {
    // Handle Google signup logic here
  };

  if (!isOpen) return null;

  return (
    <div className="signup-overlay">
      <div className="signup-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Create Account</h2>
        
        <button className="google-signup-btn" onClick={handleGoogleSignup}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Sign up with Google
        </button>
        
        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-submit-btn">Sign Up</button>
        </form>

        <div className="login-link">
          <span>Already have an account?</span>
          <a href="#" onClick={() => {
            onClose();
            // Add your login modal open logic here
          }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPopup;