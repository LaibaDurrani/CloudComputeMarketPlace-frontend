import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './styles.css';
import logo from '../../assets/logo.png';

const PricingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`pricing-page ${darkMode ? "dark" : ""}`}>
      <nav className={`navbar navbar-white ${isScrolled ? "navbar-scrolled" : ""} ${darkMode ? "dark" : ""}`}>
        <div className="nav-logo">
          <Link to="/"><img src={logo} alt="Logo" /></Link>
        </div>

        <div className="nav-center">
          <Link to="/#explore">Explore</Link>
          <Link to="/#how-it-works">How it Works</Link>
          <Link to="/pricing" className='active'>Pricing</Link>
        </div>

        <div className="nav-auth">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/">Login</Link>
          <Link to="/" className="signup-btn">Sign Up</Link>
        </div>
      </nav>

      <div className="pricing-content">
        <div className="pricing-header">
          <h2>Choose Your Computing Power</h2>
          <p>Select the perfect plan for your computational needs. Whether you're training AI models, rendering graphics, or running complex simulations.</p>
          <div className="pricing-toggle">
            <button className={!isAnnual ? 'active' : ''} onClick={() => setIsAnnual(false)}>Monthly</button>
            <button className={isAnnual ? 'active' : ''} onClick={() => setIsAnnual(true)}>Annually</button>
          </div>
        </div>

        <div className="pricing-cards">
          <div className="pricing-card free">
            <h3>Free Trial</h3>
            <p>Try our basic computing resources</p>
            <div className="price">
              $0<span>/month</span>
            </div>
            <ul className="features">
              <li>2 hours of GPU compute time</li>
              <li>Basic monitoring tools</li>
              <li>Community support</li>
              <li>Single concurrent session</li>
            </ul>
            <button className="get-started-btn">Start Free</button>
          </div>

          <div className="pricing-card featured">
            <h3>Professional</h3>
            <p>Ideal for AI training and rendering</p>
            <div className="price">
              ${isAnnual ? '1200' : '120'}<span>/{isAnnual ? 'year' : 'month'}</span>
            </div>
            <ul className="features">
              <li>High-performance GPU access</li>
              <li>Unlimited compute hours</li>
              <li>Priority technical support</li>
              <li>Advanced monitoring dashboard</li>
              <li>Resource scaling options</li>
            </ul>
            <button className="get-started-btn">Get Pro Access</button>
          </div>

          <div className="pricing-card">
            <h3>Enterprise</h3>
            <p>For large-scale computing needs</p>
            <div className="price">
              ${isAnnual ? '2400' : '240'}<span>/{isAnnual ? 'year' : 'month'}</span>
            </div>
            <ul className="features">
              <li>Custom GPU configurations</li>
              <li>Dedicated resources</li>
              <li>24/7 premium support</li>
              <li>API integration</li>
              <li>Custom security policies</li>
            </ul>
            <button className="get-started-btn">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;