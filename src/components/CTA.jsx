// components/CTA.jsx
import { useEffect, useRef } from 'react';
import './CTA.css';
import { useSectionContent } from '../hooks/useSectionContent';
import { sectionDefaults } from '../contentDefaults';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaCheckCircle,
  FaGift,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaRocket,
} from 'react-icons/fa';

const CTA = () => {
  const sectionContent = useSectionContent('cta', sectionDefaults.cta);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-section">
      {/* Animated Background */}
      <div className="cta-bg-animation">
        <div className="cta-sphere sphere-1"></div>
        <div className="cta-sphere sphere-2"></div>
        <div className="cta-sphere sphere-3"></div>
        <div className="cta-sphere sphere-4"></div>
      </div>

      <div className="cta-wrapper">
        {/* Main CTA Content */}
        <div 
          className="cta-main-content"
          ref={el => cardsRef.current[0] = el}
        >
          <div className="cta-badge">
            <FaStar className="badge-icon" />
            <span>{sectionContent.badge}</span>
          </div>

          <h1 className="cta-title">
            {sectionContent.title}
          </h1>

          <p className="cta-description">
            Join the Abundance Crossroad™ and discover the path to clarity, 
            confidence, and extraordinary success.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary-btn">
              <span>Enter the Crossroad</span>
              <FaArrowRight className="btn-arrow" />
            </Link>
            <button className="cta-secondary-btn">
              <span>Explore the Experience</span>
              <FaCheckCircle className="btn-icon" />
            </button>
          </div>

          {/* Limited Seats Indicator */}
          <div className="seats-indicator">
            <div className="seats-bar">
              <div className="seats-fill" style={{ width: '85%' }}></div>
            </div>
            <div className="seats-info">
              <FaUsers className="seats-icon" />
              <span><strong>Only 15 Seats Left</strong> - 85% Filled</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="cta-trust-badges">
            <span>
              <FaShieldAlt className="trust-icon" />
              100% Money-Back Guarantee
            </span>
            <span>
              <FaGift className="trust-icon" />
              Bonuses Included
            </span>
            <span>
              <FaCheckCircle className="trust-icon" />
              Live Interactive Session
            </span>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div 
          className="cta-info-cards"
          ref={el => cardsRef.current[1] = el}
        >
          <div className="info-card">
            <div className="info-icon">
              <FaRocket />
            </div>
            <div className="info-content">
              <h4>Transformational Experience</h4>
              <p>2-day intensive program designed for lasting change</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaUsers />
            </div>
            <div className="info-content">
              <h4>Community Support</h4>
              <p>Join a community of like-minded growth seekers</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaClock />
            </div>
            <div className="info-content">
              <h4>Flexible Schedule</h4>
              <p>Recordings available for a limited period</p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div 
          className="cta-contact"
          ref={el => cardsRef.current[2] = el}
        >
          <p className="contact-label">Have questions? Reach out to us:</p>
          <div className="contact-options">
            <a href="#" className="contact-link whatsapp">
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
            <a href="#" className="contact-link email">
              <FaEnvelope />
              <span>Email</span>
            </a>
            <a href="#" className="contact-link phone">
              <FaPhone />
              <span>Call Us</span>
            </a>
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="urgency-banner">
          <div className="urgency-content">
            <span className="urgency-icon">⚡</span>
            <span className="urgency-text">
              <strong>Early Bird Offer:</strong> Save ₹1500 - Offer Ends Soon!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
