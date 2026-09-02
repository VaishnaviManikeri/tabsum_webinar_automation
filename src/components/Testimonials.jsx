// components/Testimonials.jsx
import { useEffect, useRef, useState } from 'react';
import './Testimonials.css';
import { useSectionContent } from '../hooks/useSectionContent';
import { sectionDefaults } from '../contentDefaults';
import { Link } from 'react-router-dom';
import {
  FaStar,
  FaQuoteLeft,
  FaQuoteRight,
  FaUserCircle,
  FaPlayCircle,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaHeart,
  FaVideo,
} from 'react-icons/fa';

const Testimonials = () => {
  const sectionContent = useSectionContent('testimonials', sectionDefaults.testimonials);
  const cardsRef = useRef([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Testimonial data based on typical client feedback for such programs
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Entrepreneur & Business Owner",
      image: null,
      text: "The Abundance Crossroad™ completely transformed how I make decisions in my business. I went from feeling stuck and overwhelmed to having crystal clarity on my next steps. Within 3 months, my revenue increased by 40%.",
      rating: 5,
      before: "Struggling with business growth, feeling overwhelmed",
      after: "Clear decision-making, 40% revenue increase",
      transformation: "From confusion to clarity",
      video: false
    },
    {
      id: 2,
      name: "Rahul Mehta",
      role: "Corporate Leader",
      image: null,
      text: "I was repeating the same patterns in my career for years. Tabbasum's framework helped me identify the invisible crossroads I was missing. Now I make decisions with confidence and have seen significant career growth.",
      rating: 5,
      before: "Career stagnation, lack of direction",
      after: "Career advancement, increased confidence",
      transformation: "From stagnation to growth",
      video: false
    },
    {
      id: 3,
      name: "Ananya Reddy",
      role: "Founder & Coach",
      image: null,
      text: "This program is a game-changer! The practical framework and the community support were incredible. I've gained clarity not just in business but in all areas of my life. Highly recommend to anyone feeling stuck.",
      rating: 5,
      before: "Lack of clarity, feeling disconnected",
      after: "Clear vision, purpose-driven life",
      transformation: "From confusion to purpose",
      video: false
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "CEO & Leadership Coach",
      image: null,
      text: "Working with Tabbasum and experiencing the Abundance Crossroad™ has been transformative. The framework is practical, actionable, and delivers real results. My leadership team has seen remarkable improvement.",
      rating: 5,
      before: "Leadership challenges, team disconnection",
      after: "Strong leadership, aligned team",
      transformation: "From chaos to alignment",
      video: false
    },
    {
      id: 5,
      name: "Neha Patel",
      role: "Professional & Mother",
      image: null,
      text: "I was juggling multiple roles and felt like I was failing at all of them. The Abundance Crossroad™ helped me find balance and make decisions that align with my true priorities. Life feels purposeful again.",
      rating: 5,
      before: "Overwhelmed, lack of balance",
      after: "Balanced life, clear priorities",
      transformation: "From overwhelm to balance",
      video: false
    }
  ];

  const stats = [
    { number: "500+", label: "Clients Transformed" },
    { number: "15+", label: "Countries Reached" },
    { number: "10+", label: "Years of Experience" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
    <section className="testimonials-section">
      {/* Animated Background */}
      <div className="testimonials-bg-animation">
        <div className="testimonials-sphere sphere-1"></div>
        <div className="testimonials-sphere sphere-2"></div>
        <div className="testimonials-sphere sphere-3"></div>
      </div>

      <div className="testimonials-wrapper">
        {/* Header */}
        <div className="testimonials-header">
          <span className="testimonials-badge">
            <FaStar className="badge-icon" />
            {sectionContent.badge}
          </span>
          <h1 className="testimonials-title">
            {sectionContent.title}
          </h1>
          <div className="testimonials-underline">
            <div className="underline-glow"></div>
          </div>
          <p className="testimonials-subtitle">
            {sectionContent.subtitle}
          </p>
        </div>

        {/* Stats Section */}
        <div 
          className="stats-section"
          ref={el => cardsRef.current[0] = el}
        >
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial Slider */}
        <div 
          className="testimonial-slider"
          ref={el => cardsRef.current[1] = el}
        >
          <div className="slider-container">
            <button className="slider-btn prev" onClick={prevSlide}>
              <FaArrowLeft />
            </button>
            
            <div className="slider-track">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`testimonial-card ${index === currentSlide ? 'active' : ''}`}
                  style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                >
                  <div className="testimonial-content">
                    <FaQuoteLeft className="quote-icon left" />
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="star filled" />
                      ))}
                    </div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    <FaQuoteRight className="quote-icon right" />
                    
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <FaUserCircle />
                      </div>
                      <div className="author-info">
                        <h4>{testimonial.name}</h4>
                        <p>{testimonial.role}</p>
                      </div>
                    </div>

                    <div className="transformation-tags">
                      <span className="tag before">
                        <span className="tag-label">Before:</span>
                        {testimonial.before}
                      </span>
                      <FaArrowRight className="transform-arrow" />
                      <span className="tag after">
                        <span className="tag-label">After:</span>
                        {testimonial.after}
                      </span>
                    </div>

                    <div className="transformation-badge">
                      <FaCheckCircle />
                      <span>{testimonial.transformation}</span>
                    </div>

                    {testimonial.video && (
                      <div className="video-badge">
                        <FaVideo />
                        <span>Video Testimonial Available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="slider-btn next" onClick={nextSlide}>
              <FaArrowRight />
            </button>
          </div>

          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Video Testimonials Section */}
        <div 
          className="video-testimonials"
          ref={el => cardsRef.current[2] = el}
        >
          <h3>
            <FaVideo className="section-icon" />
            Video Testimonials
          </h3>
          <div className="video-grid">
            <div className="video-placeholder">
              <div className="video-thumbnail">
                <FaPlayCircle className="play-icon" />
                <div className="video-overlay">
                  <span>Watch Client Story</span>
                </div>
              </div>
              <p>Client Transformation Story</p>
            </div>
            <div className="video-placeholder">
              <div className="video-thumbnail">
                <FaPlayCircle className="play-icon" />
                <div className="video-overlay">
                  <span>Watch Client Story</span>
                </div>
              </div>
              <p>Success Journey</p>
            </div>
            <div className="video-placeholder">
              <div className="video-thumbnail">
                <FaPlayCircle className="play-icon" />
                <div className="video-overlay">
                  <span>Watch Client Story</span>
                </div>
              </div>
              <p>Breakthrough Experience</p>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div 
          className="social-proof"
          ref={el => cardsRef.current[3] = el}
        >
          <div className="proof-item">
            <div className="proof-icon">
              <FaHeart />
            </div>
            <div className="proof-content">
              <h4>100% Authentic</h4>
              <p>Real stories from real clients</p>
            </div>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-item">
            <div className="proof-icon">
              <FaChartLine />
            </div>
            <div className="proof-content">
              <h4>Proven Results</h4>
              <p>Measurable transformations</p>
            </div>
          </div>
          <div className="proof-divider"></div>
          <div className="proof-item">
            <div className="proof-icon">
              <FaUsers />
            </div>
            <div className="proof-content">
              <h4>Trusted Community</h4>
              <p>500+ clients served globally</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="testimonials-cta">
          <div className="cta-content-wrapper">
            <div className="cta-left">
              <h3>Your next chapter begins with a choice.</h3>
              <p>Join the Abundance Crossroad™ and start your transformation today</p>
            </div>
            <Link to="/register" className="cta-button-primary">
              Enter the Crossroad
              <FaArrowRight className="cta-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
