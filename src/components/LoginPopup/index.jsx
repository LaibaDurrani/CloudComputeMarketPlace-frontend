import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import google from "../../assets/google.svg";
import SignupPopup from '../SignupPopup';

const LoginPopup = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
      onClose();
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}

        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img src={google} alt="Google" />
          Login with Google
        </button>
        
        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="login-submit-btn">Login</button>
        </form>

        <div className="signup-link">
          <span>Don't have an account?</span>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onSwitchToSignup();
          }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;