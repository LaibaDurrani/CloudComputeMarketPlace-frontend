import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import "./styles.css";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/Logo2.png";

import SignupPopup from "../../components/SignupPopup";

import LoginPopup from "../../components/LoginPopup";
import Footer from "../../components/Footer";
import pic1 from "../../assets/pic1.png"; 
import startIcon from "../../assets/start.png"; 

import objectIcon from "../../assets/object.png";
import searchIcon from "../../assets/search.png";
import groupIcon from "../../assets/group.png";
import performanceIcon from "../../assets/performance.png";
import PricingPage from "../pricingPage";
import '../../App.css'; 

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      icon: <img src={objectIcon} alt="List Resource" style={{ width: "50px", height: "50px" }} />,
      title: "List Your Resource",
      description:
        "List your unused PCs or servers with detailed specifications and set your rental terms.",
    },
    {
      icon: <img src={searchIcon} alt="Find Computing" style={{ width: "40px", height: "38px" }} />,
      title: "Find Computing Power",
      description:
        "Browse available machines and select the perfect computing resource for your needs.",
    },
    {
      icon: <img src={groupIcon} alt="Secure Access" style={{ width: "40px", height: "50px" }} />,
      title: "Secure Access",
      description:
        "Connect securely to your rented machine using our Python-based client application.",
    },
    {
      icon: <img src={performanceIcon} alt="Monitor Performance" style={{ width: "40px", height: "40px" }} />,
      title: "Monitor Performance",
      description: "Track resource usage and performance metrics in real-time.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
    const section = document.getElementById("how-it-works");
    section.scrollIntoView({ behavior: "smooth" });
  };

  const [computers] = useState([
    {
      id: 1,
      name: "Deep Learning Workstation",
      specs: { gpu: "2x NVIDIA A100" },
      price: 8.5,
      useCase: ["AI & ML Training"],
    },
    {
      id: 2,
      name: "Rendering Powerhouse",
      specs: { gpu: "NVIDIA RTX 4090" },
      price: 6.75,
      useCase: ["3D Rendering"],
    },
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        } else {
          entry.target.classList.remove('animate');
        }
      });
    }, { threshold: 0.2 });
  
    const statsHeader = document.querySelector('.stats-header');
    const heroContent = document.querySelector('.hero-content');
    
    if (statsHeader) {
      observer.observe(statsHeader);
    }
    if (heroContent) {
      observer.observe(heroContent);
    }

    return () => observer.disconnect();
  }, []);


  return (
    <div className={`landing-page ${darkMode ? "dark" : ""}`}>
      <div className="hero-section">        <nav
          className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
            darkMode ? "dark" : ""
          }`}
        >          <div className="nav-logo">
            <img src={isScrolled ? logo : logo2} alt="Logo" />
          </div>

          <div className="nav-center">
            <a href="#explore" className="active">Explore</a>
            <a href="#how-it-works">How it Works</a>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div className="nav-auth">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLoginOpen(true);
              }}
            >
              Login
            </a>
            <a
              href="#"
              className="signup-btn"
              onClick={(e) => {
                e.preventDefault();
                setIsSignupOpen(true);
              }}
            >
              Sign Up
            </a>
          </div>
        </nav>        <div className="hero-content">
          <div>
            <div className="hero-nimbus-logo">
              <div className="nimbus-logo">
                <span>N</span>
                <span>i</span>
                <span>m</span>
                <span>b</span>
                <span>u</span>
                <span>s</span>
              </div>
            </div>
            <h1 className="animated-tagline">
              Cloud Computing <span className="highlight">Simplified</span>
            </h1>
            <p className="hero-description">
              Access powerful computing resources on demand through our peer-to-peer marketplace
            </p>
            <button 
              className="get-started-btn"
              onClick={(e) => {
                e.preventDefault();
                setIsSignupOpen(true);
              }}
            >
              Get Started
            </button>
          </div>
          <div className="hero-image">
            <img src={pic1} alt="Cloud Computing Illustration" />
          </div>
        </div>
      </div>

      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="carousel-container">
          <div
            className="carousel-content"
            style={{
              transform: `translateX(-${currentSlide * 33.33}%)`,
              transition:
                currentSlide === 0 ? "none" : "transform 0.5s ease-in-out",
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
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-header">
            <h2>Helping users access <span className="stats-highlight">computing</span> power </h2>
            <p>We've grown through dedication and innovation</p>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">100</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50</div>
              <div className="stat-label">Available Machines</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100</div>
              <div className="stat-label">Completed Tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100</div>
              <div className="stat-label">Successful Payments</div>
            </div>
          </div>
        </div>
      </section>

      <section className="explore-section">
        <h2>Available Computing Resources</h2>
        <div className="carousel-container">
          <div className="carousel-content">
            {computers.map((computer) => (
              <div
                key={computer.id}
                className="step clickable computer-card"
                onClick={() => setIsSignupOpen(true)}
              >
                <div className="step-icon">
                  <img src={objectIcon} alt="Computer" style={{ width: "40px", height: "40px" }} />
                </div>
                <h3>{computer.name}</h3>
                <div className="computer-preview">
                  <div className="preview-header">
                    <div className="preview-price">${computer.price}/hr</div>
                  </div>
                  <div className="preview-specs">
                    <span className="gpu-spec">{computer.specs.gpu}</span>
                  </div>
                  <div className="preview-tags">
                    {computer.useCase.map((uc) => (
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
              <div className="step-icon">
                <img src={searchIcon} alt="Search" style={{ width: "40px", height: "40px" }} />
              </div>
              <h3>View More</h3>
              <span className="view-more-btn">
                Browse All Resources
                <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Boost Your Computing Power?</h2>
          <p>Join countless others who have transformed their computing capabilities with our peer-to-peer platform</p>
          <button 
            className="cta-button"
            onClick={(e) => {
              e.preventDefault();
              setIsSignupOpen(true);
            }}
          >
            Get Started Now
          </button>
        </div>
        <div className="cta-image">
          <img src={startIcon} alt="Computing Power Illustration" />
        </div>
      </section>

      <SignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;
