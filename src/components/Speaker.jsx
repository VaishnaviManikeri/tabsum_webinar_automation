// components/Speaker.jsx
import { useEffect, useRef } from 'react';
import './Speaker.css';
import { useSectionContent } from '../hooks/useSectionContent';
import { sectionDefaults } from '../contentDefaults';
import speakerImage from '/assets/speaker.png'; // Update this path to your actual image
import {
  FaInstagram,
  FaGlobe,
  FaQuoteLeft,
  FaQuoteRight,
  FaAward,
  FaUsers,
  FaLightbulb,
  FaStar,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

const Speaker = () => {
  const sectionContent = useSectionContent('speaker', sectionDefaults.speaker);
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
    <section className="speaker-section">
      {/* Animated Background */}
      <div className="speaker-bg-animation">
        <div className="speaker-sphere sphere-1"></div>
        <div className="speaker-sphere sphere-2"></div>
        <div className="speaker-sphere sphere-3"></div>
      </div>

      <div className="speaker-wrapper">
        {/* Header */}
        <div className="speaker-header">
          <span className="speaker-badge">
            <FaStar className="badge-icon" />
            {sectionContent.badge}
          </span>
          <h1 className="speaker-title">
            {sectionContent.title}
          </h1>
          <div className="speaker-underline">
            <div className="underline-glow"></div>
          </div>
          <p className="speaker-subtitle">
            Discover the visionary behind the Abundance Crossroad™ framework
          </p>
        </div>

        {/* Main Speaker Card */}
        <div 
          className="speaker-main-card"
          ref={el => cardsRef.current[0] = el}
        >
          <div className="speaker-profile">
            <div className="speaker-image-wrapper">
              <div className="speaker-image">
                <img 
                  src={speakerImage} 
                  alt="Tabbasum Mullani - Speaker" 
                  className="speaker-img"
                />
                <div className="image-ring"></div>
              </div>
              <div className="speaker-status">
                <span className="status-dot"></span>
                Available for Speaking
              </div>
            </div>

            <div className="speaker-info">
              <h2 className="speaker-name">Tabbasum Mullani</h2>
              <p className="speaker-role">Creator of Abundance Crossroad™</p>
              
              <div className="speaker-quote">
                <FaQuoteLeft className="quote-icon left" />
                <p>
                  Helping people stop repeating the same results and start 
                  consciously creating the future they truly want.
                </p>
                <FaQuoteRight className="quote-icon right" />
              </div>

              <div className="speaker-bio">
                <p>
                  Tabbasum Mullani is the creator of Abundance Crossroad™ framework 
                  and founder of Infinite Blessing. She works with entrepreneurs, 
                  executives, business owners and professionals who want greater 
                  clarity, stronger decision-making and a more purposeful life.
                </p>
                <p>
                  Through her proprietary approach, she helps clients uncover the 
                  hidden patterns influencing their most important decisions, enabling 
                  them to move forward with greater confidence, alignment and intention. 
                  Her mission is to help people stop repeating the same results and 
                  start consciously creating the future they truly want.
                </p>
              </div>

              <div className="speaker-social">
                <a href="https://instagram.com/tabbasummullani" className="social-link instagram">
                  <FaInstagram />
                  <span>@tabbasummullani</span>
                </a>
                <a href="https://instagram.com/abundancecrossroad" className="social-link instagram">
                  <FaInstagram />
                  <span>@abundancecrossroad</span>
                </a>
                <a href="https://www.tabbasummullani.com" className="social-link website">
                  <FaGlobe />
                  <span>www.tabbasummullani.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Key Credentials */}
        <div 
          className="credentials-section"
          ref={el => cardsRef.current[1] = el}
        >
          <h3 className="section-subtitle">
            <span className="section-icon">✦</span>
            Key Credentials
          </h3>
          <div className="credentials-grid">
            <div className="credential-item">
              <div className="credential-icon">
                <FaAward />
              </div>
              <div className="credential-content">
                <h4>Founder</h4>
                <p>Infinite Blessing</p>
              </div>
            </div>

            <div className="credential-item">
              <div className="credential-icon">
                <FaLightbulb />
              </div>
              <div className="credential-content">
                <h4>Creator</h4>
                <p>Abundance Crossroad™</p>
              </div>
            </div>

            <div className="credential-item">
              <div className="credential-icon">
                <FaUsers />
              </div>
              <div className="credential-content">
                <h4>International Speaker</h4>
                <p>& Transformation Coach</p>
              </div>
            </div>

            <div className="credential-item">
              <div className="credential-icon">
                <FaGlobe />
              </div>
              <div className="credential-content">
                <h4>Global Impact</h4>
                <p>Worked with clients across multiple countries</p>
              </div>
            </div>

            <div className="credential-item credential-full">
              <div className="credential-icon">
                <FaStar />
              </div>
              <div className="credential-content">
                <h4>Transformational Frameworks</h4>
                <p>Creator of coaching frameworks integrating awareness, reflection and personal growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats / Impact Section */}
        <div className="impact-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Clients Transformed</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Countries Reached</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Years of Experience</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Client Satisfaction</div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="connect-section">
          <div className="connect-content">
            <h3>Connect With Tabbasum</h3>
            <p>Follow her journey and join the Abundance Crossroad™ community</p>
            <div className="connect-social">
              <a href="#" className="connect-link instagram">
                <FaInstagram />
              </a>
              <a href="#" className="connect-link linkedin">
                <FaLinkedinIn />
              </a>
              <a href="#" className="connect-link twitter">
                <FaTwitter />
              </a>
              <a href="#" className="connect-link youtube">
                <FaYoutube />
              </a>
              <a href="#" className="connect-link website">
                <FaGlobe />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speaker;
