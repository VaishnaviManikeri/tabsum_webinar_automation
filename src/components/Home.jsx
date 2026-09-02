import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import api from '../api';

import {
  FaCalendarAlt,
  FaClock,
  FaGlobe,
  FaVideo,
  FaRupeeSign,
  FaArrowRight,
  FaPlayCircle,
  FaUsers,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const Home = () => {
  const [webinarData, setWebinarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebinarData();
  }, []);

  const fetchWebinarData = async () => {
    try {
      const response = await api.get('/webinar');
      if (response.data.success) {
        setWebinarData(response.data.data);
      } else {
        // Use default data if no data from API
        setWebinarData({
          title: 'The Abundance Crossroad™',
          subtitle: 'The 2-Day Experience That Will Transform the Way You Make Decisions About Money, Success, Leadership and Life.',
          date: 'To be Updated',
          time: '2 Days',
          duration: '2 Hours / Day',
          language: 'English',
          platform: 'Zoom',
          price: '249',
          background_image: '/assets/h11.png'
        });
      }
    } catch (error) {
      console.error('Error fetching webinar data:', error);
      // Use default data on error
      setWebinarData({
        title: 'The Abundance Crossroad™',
        subtitle: 'The 2-Day Experience That Will Transform the Way You Make Decisions About Money, Success, Leadership and Life.',
        date: 'To be Updated',
        time: '2 Days',
        duration: '2 Hours / Day',
        language: 'English',
        platform: 'Zoom',
        price: '249',
        background_image: '/assets/h11.png'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const data = webinarData || {
    title: 'The Abundance Crossroad™',
    subtitle: 'The 2-Day Experience That Will Transform the Way You Make Decisions About Money, Success, Leadership and Life.',
    date: 'To be Updated',
    time: '2 Days',
    duration: '2 Hours / Day',
    language: 'English',
    platform: 'Zoom',
    price: '249',
    background_image: '/assets/h11.png'
  };

  // Construct image URL - handle both local and uploaded images
  const backgroundImageUrl = data.background_image && data.background_image.startsWith('/uploads/')
    ? `http://localhost:5000${data.background_image}`
    : data.background_image || '/assets/h11.png';

  return (
    <section className="hero-section">
      <img 
        src={backgroundImageUrl} 
        alt="Webinar Background" 
        className="hero-bg" 
        onError={(e) => {
          e.target.src = '/assets/h11.png';
        }}
      />

      <div className="hero-content">
        <span className="hero-tag">
          <FaPlayCircle className="tag-icon" />
          Live Premium Webinar
        </span>

        <h1>
          The <span>{data.title}</span>
        </h1>

        <p>{data.subtitle}</p>

        <Link to="/register" className="hero-btn">
          Reserve My Seat
          <FaArrowRight className="btn-arrow" />
        </Link>

        <div className="trust-badges">
          <span>
            <FaCheckCircle className="trust-icon" />
            100% Satisfaction Guarantee
          </span>
          <span>
            <FaCheckCircle className="trust-icon" />
            Live Interactive Session
          </span>
          <span>
            <FaCheckCircle className="trust-icon" />
            Limited Seats Available
          </span>
        </div>
      </div>

      <div className="floating-card-wrapper">
        <div className="floating-card">
          <div className="card-item">
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <div>
              <h4>Date</h4>
              <p>{data.date}</p>
            </div>
          </div>

          <div className="card-item">
            <div className="card-icon">
              <FaClock />
            </div>
            <div>
              <h4>Time</h4>
              <p>{data.time}</p>
            </div>
          </div>

          <div className="card-item">
            <div className="card-icon">
              <FaClock />
            </div>
            <div>
              <h4>Duration</h4>
              <p>{data.duration}</p>
            </div>
          </div>

          <div className="card-item">
            <div className="card-icon">
              <FaGlobe />
            </div>
            <div>
              <h4>Language</h4>
              <p>{data.language}</p>
            </div>
          </div>

          <div className="card-item">
            <div className="card-icon">
              <FaVideo />
            </div>
            <div>
              <h4>Platform</h4>
              <p>{data.platform}</p>
            </div>
          </div>

          <div className="card-item card-item-highlight">
            <div className="card-icon price-icon">
              <FaRupeeSign />
            </div>
            <div>
              <h4>Price</h4>
              <p>
                ₹{data.price} <span className="price-tag">Only</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <div className="footer-item">
            <FaUsers className="footer-icon" />
            <span>Limited Seats: <strong>Only 100 Spots</strong></span>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-item">
            <FaStar className="footer-icon star-icon" />
            <span>Rated <strong>4.9/5</strong> by 500+ Attendees</span>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-item">
            <span className="bonus-tag">🎁 Bonus</span>
            <span>Free E-Book Included</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
