import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import google from "../../assets/google.svg";

const SignupPopup = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await axios.post('http://localhost:5000/api/auth/signup', signupData);
      console.log('Signup successful:', response.data);
      onClose();
    } catch (err) {
      console.error('Signup error:', err.response?.data);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        
        {error && <div className="error-message">{error}</div>}

        <button className="google-signup-btn" onClick={handleGoogleSignup}>
        <img src={google} alt="Google" />
          Sign up with Google
        </button>
        
        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
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
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin();
          }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPopup;