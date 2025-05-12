import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './styles.css';
import google from "../../assets/google.svg";

const SignupPopup = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileType: 'buyer' // Default to 'buyer'
  });
  const [localError, setLocalError] = useState('');
  const { register, error, clearErrors } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setLocalError('');

    // Validate password length
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
      try {
      setIsSubmitting(true);
      const { confirmPassword, ...signupData } = formData;
      // Register will automatically redirect to dashboard via AuthContext
      await register(signupData);
      onClose();
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.data?.error) {
        setLocalError(err.response.data.error);
      } else if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        setLocalError(err.response.data.errors[0].msg);
      }
      // Other errors are handled in the AuthContext
    } finally {
      setIsSubmitting(false);
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
        
        {(localError || error) && <div className="error-message">{localError || error}</div>}

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
          </div>          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />          </div>          <div className="form-group profile-type-group">
            <label htmlFor="profileTypeSelect" className="form-label">Account type</label>
            <select
              id="profileTypeSelect"
              name="profileType"
              value={formData.profileType}
              onChange={handleChange}
              required
            >              <option value="buyer">I want to rent computers</option>
              <option value="seller">I want to offer my computers</option>
              <option value="both">Both</option>
            </select>
          </div>
          <button type="submit" className="signup-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
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