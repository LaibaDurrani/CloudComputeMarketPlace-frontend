import React, { useState } from 'react';
import './styles.css';

const LoginPopup = ({ isOpen, onClose, onSignupClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    // Handle login logic here
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Welcome Back</h2>
        
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
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
            onClose();
            onSignupClick();
          }}>Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;