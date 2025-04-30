import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import pic1 from '../../assets/pic1.png';
import logo from '../../assets/logo.png';

import SignupPopup from '../../components/SignupPopup';

import LoginPopup from '../../components/LoginPopup';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      icon: "💻",
      title: "List Your Resource",
      description: "List your unused PCs or servers with detailed specifications and set your rental terms."
    },
    {
      icon: "🔍",
      title: "Find Computing Power",
      description: "Browse available machines and select the perfect computing resource for your needs."
    },
    {
      icon: "🔐",
      title: "Secure Access",
      description: "Connect securely to your rented machine using our Python-based client application."
    },
    {
      icon: "📊",
      title: "Monitor Performance",
      description: "Track resource usage and performance metrics in real-time."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Create a duplicated array for seamless looping
  const extendedSlides = [...slides, ...slides.slice(0, 3)];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const section = document.getElementById('how-it-works');
    section.scrollIntoView({ behavior: 'smooth' });
  };

  const [computers] = useState([
    {
      id: 1,
      name: "Deep Learning Workstation",
      specs: { gpu: "2x NVIDIA A100" },
      price: 8.50,
      useCase: ["AI & ML Training"]
    },
    {
      id: 2,
      name: "Rendering Powerhouse",
      specs: { gpu: "NVIDIA RTX 4090" },
      price: 6.75,
      useCase: ["3D Rendering"]
    }
  ]);
  
  const scrollToExplore = (e) => {
    e.preventDefault();
    const section = document.getElementById('explore');
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <div className="hero-section" style={{ backgroundImage: `url(${pic1})` }}>
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
          <div className="nav-logo">
            <img src={logo} alt="Logo" />
          </div>
          
          <div className="nav-center">
            <a href="#explore" onClick={scrollToExplore}>Explore</a>
            <a href="#how-it-works" onClick={scrollToHowItWorks}>How it Works</a>
          </div>
          
          <div className="nav-auth">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsLoginOpen(true);
            }}>Login</a>
            <a href="#" className="signup-btn" onClick={(e) => {
              e.preventDefault();
              setIsSignupOpen(true);
            }}>Sign Up</a>
          </div>
        </nav>
      </div>
      
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="carousel-container">
          <div 
            className="carousel-content"
            style={{ 
              transform: `translateX(-${currentSlide * 33.33}%)`,
              transition: currentSlide === 0 ? 'none' : 'transform 0.5s ease-in-out'
            }}
          >
            {extendedSlides.map((slide, index) => (
              <div className="step" key={index}>
                <div className="step-icon">{slide.icon}</div>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            ))}
          </div>
          
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section id="explore" className="explore-section">
        <h2>Available Computing Resources</h2>
        <div className="carousel-container">
          <div className="carousel-content">
            {computers.map(computer => (
              <div 
                key={computer.id} 
                className="step clickable" 
                onClick={() => setIsSignupOpen(true)}
              >
                <div className="step-icon">💻</div>
                <h3>{computer.name}</h3>
                <div className="computer-preview">
                  <div className="preview-price">${computer.price}/hr</div>
                  <div className="preview-specs">
                    <span className="gpu-spec">{computer.specs.gpu}</span>
                  </div>
                  <div className="preview-tags">
                    {computer.useCase.map(uc => (
                      <span key={uc} className="preview-tag">{uc}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div 
              className="step view-more-step clickable"
              onClick={() => setIsSignupOpen(true)}
            >
              <div className="step-icon">🔍</div>
              <h3>View More</h3>
              <span className="view-more-btn">
                Browse All Resources
                <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <SignupPopup 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)}
        onLoginClick={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
      
      <LoginPopup 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;