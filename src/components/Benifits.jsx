// components/Benefits.jsx
import { useEffect, useRef } from 'react';
import './Benefits.css';
import { useSectionContent } from '../hooks/useSectionContent';
import { sectionDefaults } from '../contentDefaults';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaLightbulb,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaBookOpen,
  FaPenFancy,
  FaClipboardList,
  FaVideo,
  FaBrain,
  FaArrowRight,
  FaStar,
  FaGift,
} from 'react-icons/fa';

const Benefits = () => {
  const sectionContent = useSectionContent('benefits', sectionDefaults.benefits);
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
    <section className="benefits-section">
      {/* Animated Background */}
      <div className="benefits-bg-animation">
        <div className="benefits-sphere sphere-1"></div>
        <div className="benefits-sphere sphere-2"></div>
        <div className="benefits-sphere sphere-3"></div>
      </div>

      <div className="benefits-wrapper">
        {/* Header */}
        <div className="benefits-header">
          <span className="benefits-badge">
            <FaStar className="badge-icon" />
            {sectionContent.badge}
          </span>
          <h1 className="benefits-title">
            {sectionContent.title}
          </h1>
          <div className="benefits-underline">
            <div className="underline-glow"></div>
          </div>
          <p className="benefits-subtitle">
            Discover what awaits you at the Abundance Crossroad™ experience
          </p>
        </div>

        {/* Benefits Grid */}
        <div 
          className="benefits-grid"
          ref={el => cardsRef.current[0] = el}
        >
          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <FaLightbulb className="benefit-icon" />
            </div>
            <h3>Gain Clarity</h3>
            <p>Gain clarity on the decisions shaping your future</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <FaRocket className="benefit-icon" />
            </div>
            <h3>Understand Success</h3>
            <p>Learn why success feels harder than it should</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <FaShieldAlt className="benefit-icon" />
            </div>
            <h3>Break Free</h3>
            <p>Discover what&apos;s really keeping you stuck</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <FaCheckCircle className="benefit-icon" />
            </div>
            <h3>Build Confidence</h3>
            <p>Develop greater confidence before making major life decisions</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <FaBookOpen className="benefit-icon" />
            </div>
            <h3>Practical Framework</h3>
            <p>Learn a practical framework you can apply immediately</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <FaUsers className="benefit-icon" />
            </div>
            <h3>Community</h3>
            <p>Meet a community committed to conscious growth</p>
          </div>
        </div>

        {/* Bonuses Section */}
        <div 
          className="bonuses-section"
          ref={el => cardsRef.current[1] = el}
        >
          <div className="bonuses-header">
            <span className="bonuses-tag">
              <FaGift className="tag-icon" />
              Exclusive Bonuses
            </span>
            <h2>
              What You&apos;ll <span>Receive</span>
            </h2>
            <p>Valuable resources to accelerate your transformation</p>
          </div>

          <div className="bonuses-grid">
            <div className="bonus-item">
              <div className="bonus-number">01</div>
              <div className="bonus-content">
                <div className="bonus-icon-wrapper">
                  <FaBookOpen />
                </div>
                <div>
                  <h4>Digital Abundance Crossroad Workbook</h4>
                  <p>Comprehensive workbook to guide your transformation journey</p>
                </div>
              </div>
            </div>

            <div className="bonus-item">
              <div className="bonus-number">02</div>
              <div className="bonus-content">
                <div className="bonus-icon-wrapper">
                  <FaPenFancy />
                </div>
                <div>
                  <h4>Decision Reflection Journal</h4>
                  <p>Structured journal to reflect and track your decision-making growth</p>
                </div>
              </div>
            </div>

            <div className="bonus-item">
              <div className="bonus-number">03</div>
              <div className="bonus-content">
                <div className="bonus-icon-wrapper">
                  <FaClipboardList />
                </div>
                <div>
                  <h4>Action Planning Template</h4>
                  <p>Strategic template to implement your learnings effectively</p>
                </div>
              </div>
            </div>

            <div className="bonus-item">
              <div className="bonus-number">04</div>
              <div className="bonus-content">
                <div className="bonus-icon-wrapper">
                  <FaVideo />
                </div>
                <div>
                  <h4>Access to Replay</h4>
                  <p>Limited period access to webinar replay (if applicable)</p>
                </div>
              </div>
            </div>

            <div className="bonus-item bonus-highlight">
              <div className="bonus-number">05</div>
              <div className="bonus-content">
                <div className="bonus-icon-wrapper">
                  <FaBrain />
                </div>
                <div>
                  <h4>Bonus Guided Reflection Exercise</h4>
                  <p>Powerful guided exercise for deep personal insight</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="benefits-cta">
          <div className="cta-content-wrapper">
            <div className="cta-left">
              <h3>Ready to Transform Your Life?</h3>
              <p>Join the Abundance Crossroad™ and unlock your true potential</p>
            </div>
            <Link to="/register" className="cta-button-primary">
              Reserve Your Seat Now
              <FaArrowRight className="cta-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
