// components/Agenda.jsx
import { useEffect, useRef, useState } from 'react';
import './Agenda.css';
import { useSectionContent } from '../hooks/useSectionContent';
import { sectionDefaults } from '../contentDefaults';
import { Link } from 'react-router-dom';
import {
  FaCalendarDay,
  FaCalendarWeek,
  FaLightbulb,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaClipboardCheck,
  FaQuestionCircle,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaBrain,
  FaHands,
  FaCrown,
} from 'react-icons/fa';

const Agenda = () => {
  const sectionContent = useSectionContent('agenda', sectionDefaults.agenda);
  const cardsRef = useRef([]);
  const [activeDay, setActiveDay] = useState('day1');

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
    <section className="agenda-section">
      {/* Animated Background */}
      <div className="agenda-bg-animation">
        <div className="agenda-sphere sphere-1"></div>
        <div className="agenda-sphere sphere-2"></div>
        <div className="agenda-sphere sphere-3"></div>
      </div>

      <div className="agenda-wrapper">
        {/* Header */}
        <div className="agenda-header">
          <span className="agenda-badge">
            <FaCalendarWeek className="badge-icon" />
            {sectionContent.badge}
          </span>
          <h1 className="agenda-title">
            {sectionContent.title}
          </h1>
          <div className="agenda-underline">
            <div className="underline-glow"></div>
          </div>
          <p className="agenda-subtitle">
            A transformative 2-day experience designed to reshape your future
          </p>
        </div>

        {/* Day Selector */}
        <div className="day-selector">
          <button 
            className={`day-btn ${activeDay === 'day1' ? 'active' : ''}`}
            onClick={() => setActiveDay('day1')}
          >
            <FaCalendarDay className="day-icon" />
            <span>Day One</span>
            <span className="day-subtitle">The Hidden Crossroads</span>
          </button>
          <button 
            className={`day-btn ${activeDay === 'day2' ? 'active' : ''}`}
            onClick={() => setActiveDay('day2')}
          >
            <FaCalendarDay className="day-icon" />
            <span>Day Two</span>
            <span className="day-subtitle">The Abundance Framework</span>
          </button>
        </div>

        {/* Agenda Content */}
        <div className="agenda-content">
          {/* Day One */}
          <div 
            className={`agenda-day ${activeDay === 'day1' ? 'active' : 'hidden'}`}
            ref={el => cardsRef.current[0] = el}
          >
            <div className="day-header">
              <div className="day-number-wrapper">
                <span className="day-number">01</span>
                <div className="day-ring"></div>
              </div>
              <div className="day-info">
                <h2>Day One</h2>
                <p className="day-theme">The Hidden Crossroads</p>
              </div>
            </div>

            <div className="sessions-grid">
              <div className="session-item">
                <div className="session-number">01</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaBrain />
                  </div>
                  <div>
                    <h4>Why people repeat the same results</h4>
                    <p>Understand the psychological patterns that keep you stuck in repetitive cycles</p>
                  </div>
                </div>
              </div>

              <div className="session-item">
                <div className="session-number">02</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaLightbulb />
                  </div>
                  <div>
                    <h4>The energy of decisions</h4>
                    <p>Discover how your energetic state influences every choice you make</p>
                  </div>
                </div>
              </div>

              <div className="session-item">
                <div className="session-number">03</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaChartLine />
                  </div>
                  <div>
                    <h4>Business, money and leadership crossroads</h4>
                    <p>Identify the critical decision points in your professional journey</p>
                  </div>
                </div>
              </div>

              <div className="session-item session-highlight">
                <div className="session-number">04</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaClipboardCheck />
                  </div>
                  <div>
                    <h4>Reflection exercises</h4>
                    <p>Deep personal reflection to uncover your hidden patterns</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="day-timeline">
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Session 1: 9:00 AM - 10:30 AM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Break: 10:30 AM - 10:45 AM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Session 2: 10:45 AM - 12:30 PM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Lunch Break: 12:30 PM - 1:30 PM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Session 3: 1:30 PM - 3:00 PM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Closing Reflection: 3:00 PM - 3:30 PM</span>
              </div>
            </div>
          </div>

          {/* Day Two */}
          <div 
            className={`agenda-day ${activeDay === 'day2' ? 'active' : 'hidden'}`}
            ref={el => cardsRef.current[1] = el}
          >
            <div className="day-header">
              <div className="day-number-wrapper">
                <span className="day-number">02</span>
                <div className="day-ring"></div>
              </div>
              <div className="day-info">
                <h2>Day Two</h2>
                <p className="day-theme">The Abundance Crossroad Framework™</p>
              </div>
            </div>

            <div className="sessions-grid">
              <div className="session-item">
                <div className="session-number">01</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaRocket />
                  </div>
                  <div>
                    <h4>Building clarity</h4>
                    <p>Learn powerful techniques to gain crystal clarity in all areas of life</p>
                  </div>
                </div>
              </div>

              <div className="session-item">
                <div className="session-number">02</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaCrown />
                  </div>
                  <div>
                    <h4>Creating extraordinary decisions</h4>
                    <p>Master the art of decision-making that leads to exceptional outcomes</p>
                  </div>
                </div>
              </div>

              <div className="session-item">
                <div className="session-number">03</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaHands />
                  </div>
                  <div>
                    <h4>Real-life applications</h4>
                    <p>Apply the framework to your real-world challenges and opportunities</p>
                  </div>
                </div>
              </div>

              <div className="session-item">
                <div className="session-number">04</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaClipboardCheck />
                  </div>
                  <div>
                    <h4>Action plan</h4>
                    <p>Create a strategic action plan to implement your learnings</p>
                  </div>
                </div>
              </div>

              <div className="session-item session-highlight">
                <div className="session-number">05</div>
                <div className="session-content">
                  <div className="session-icon-wrapper">
                    <FaUsers />
                  </div>
                  <div>
                    <h4>Live coaching</h4>
                    <p>Get personalized coaching and feedback in real-time</p>
                  </div>
                </div>
              </div>

              <div className="session-item session-premium">
                <div className="session-number">06</div>
                <div className="session-content">
                  <div className="session-icon-wrapper premium-icon">
                    <FaQuestionCircle />
                  </div>
                  <div>
                    <h4>Live Q&A</h4>
                    <p>Get all your questions answered by the expert</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="day-timeline">
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Session 1: 9:00 AM - 10:30 AM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Break: 10:30 AM - 10:45 AM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Session 2: 10:45 AM - 12:30 PM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Lunch Break: 12:30 PM - 1:30 PM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Session 3: 1:30 PM - 3:00 PM</span>
              </div>
              <div className="timeline-item">
                <FaClock className="timeline-icon" />
                <span>Closing & Q&A: 3:00 PM - 3:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div 
          className="takeaways-section"
          ref={el => cardsRef.current[2] = el}
        >
          <h3 className="takeaways-title">
            <FaStar className="takeaways-icon" />
            Key Takeaways
          </h3>
          <div className="takeaways-grid">
            <div className="takeaway-item">
              <FaCheckCircle className="takeaway-check" />
              <span>Understand why you repeat the same patterns</span>
            </div>
            <div className="takeaway-item">
              <FaCheckCircle className="takeaway-check" />
              <span>Identify your invisible crossroads</span>
            </div>
            <div className="takeaway-item">
              <FaCheckCircle className="takeaway-check" />
              <span>Learn the Abundance Crossroad Framework™</span>
            </div>
            <div className="takeaway-item">
              <FaCheckCircle className="takeaway-check" />
              <span>Create a personalized action plan</span>
            </div>
            <div className="takeaway-item">
              <FaCheckCircle className="takeaway-check" />
              <span>Gain clarity and confidence in decision-making</span>
            </div>
            <div className="takeaway-item">
              <FaCheckCircle className="takeaway-check" />
              <span>Join a community of conscious growth seekers</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="agenda-cta">
          <div className="cta-content-wrapper">
            <div className="cta-left">
              <h3>Ready to Begin Your Transformation?</h3>
              <p>Secure your spot for this life-changing 2-day experience</p>
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

export default Agenda;
