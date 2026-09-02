// components/About.jsx
import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './About.css';

const defaultAbout = {
  badge: 'The Crossroad 2026', title: 'About the Experience',
  subtitle: 'A private invitation to the decision that could change what comes next',
  leadText: 'Some decisions shape everything. Others quietly shape the life you will live.',
  description: 'The question is rarely whether you are capable of more. It is whether you are ready to see what has been influencing your choices.',
  highlightText: 'The Abundance Crossroad™ is a two-day experience for people standing at a meaningful turning point—ready to make the next decision with greater clarity.',
  topics: ['Why intelligent people unknowingly repeat the same results', 'The invisible crossroads that shape your future', 'Why hard work alone rarely creates extraordinary success', 'The hidden patterns influencing your biggest decisions', 'How to create greater clarity before making life-changing decisions', 'A new framework for building wealth, purpose, leadership and fulfillment', 'Practical exercises to apply the Crossroad Framework immediately'],
  outcomes: ['Understand why they continue repeating certain life patterns', 'Learn how to identify invisible crossroads before making major decisions', 'Gain greater clarity and confidence in business and personal life', 'Learn a practical framework for making higher-quality decisions', 'Leave with a completely different way of thinking about success and abundance'],
  audience: ['Business owners', 'CEOs', 'Founders', 'Senior leaders', 'Professionals', 'Entrepreneurs', 'Coaches', 'Consultants'],
  problems: ['Feeling stuck despite working hard', 'Lack of clarity', 'Overthinking', 'Fear of making the wrong decision', 'Business growth plateau', 'Money blocks', 'Career stagnation', 'Loss of purpose', "Feeling disconnected from one's potential", 'Repeating the same patterns in relationships or work'],
  notSuitable: ['People looking for quick fixes', 'People unwilling to take responsibility for their decisions', 'Those who are not open to self-reflection or personal growth', 'People expecting instant financial results without applying what they learn'],
  ctaTitle: 'What could one better decision make possible?',
  ctaText: 'Join us at the Abundance Crossroad™ and discover the path to clarity, confidence, and success.',
  ctaButton: 'Enter the Crossroad'
};

const About = () => {
  const cardsRef = useRef([]);
  const [aboutData, setAboutData] = useState(defaultAbout);

  useEffect(() => {
    api.get('/about')
      .then(response => {
        const record = response.data.data?.[0];
        if (record) setAboutData({ ...defaultAbout, ...record });
      })
      .catch(error => console.error('Error fetching About content:', error));
  }, []);

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
    <div className="about-container">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      <div className="about-wrapper">
        {/* Header */}
        <div className="about-header">
          <div className="badge-container">
            <span className="webinar-badge">
              <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              {aboutData.badge}
            </span>
          </div>
          <h1 className="about-title">
            {aboutData.title}
          </h1>
          <div className="title-underline">
            <div className="underline-glow"></div>
          </div>
          <p className="subtitle">{aboutData.subtitle}</p>
        </div>

        {/* Brief Description */}
        <div 
          className="card card-premium"
          ref={el => cardsRef.current[0] = el}
        >
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </span>
              Brief Description
            </h2>
            <div className="card-accent"></div>
          </div>
          <div className="description-content">
            <p className="lead-text">
              {aboutData.leadText}
            </p>
            <p>
              {aboutData.description}
            </p>
            <div className="highlight-box">
              <p>
                {aboutData.highlightText}
              </p>
            </div>
          </div>
        </div>

        {/* Key Topics */}
        <div 
          className="card card-premium"
          ref={el => cardsRef.current[1] = el}
        >
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </span>
              Questions We Will Explore
            </h2>
            <div className="card-accent"></div>
          </div>
          <div className="topics-grid">
            {aboutData.topics.map((topic, index) => (
              <div key={index} className="topic-item">
                <div className="topic-number">{String(index + 1).padStart(2, '0')}</div>
                <span className="topic-text">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div 
          className="card card-premium"
          ref={el => cardsRef.current[2] = el}
        >
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </span>
              What You May See Differently
            </h2>
            <div className="card-accent"></div>
          </div>
          <div className="outcomes-grid">
            {aboutData.outcomes.map((outcome, index) => (
              <div key={index} className="outcome-item">
                <div className="outcome-number">{index + 1}</div>
                <div className="outcome-content">
                  <span className="outcome-text">{outcome}</span>
                  <div className="outcome-progress">
                    <div 
                      className="outcome-progress-bar" 
                      style={{ width: `${(index + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience & Problems */}
        <div className="two-column-grid">
          {/* Who Should Attend */}
          <div 
            className="card card-premium"
            ref={el => cardsRef.current[3] = el}
          >
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                Who This Is For
              </h2>
              <div className="card-accent"></div>
            </div>
            <div className="audience-grid">
              {aboutData.audience.map((item, index) => (
                <div key={index} className="audience-item">
                  <div className="audience-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <span className="audience-text">{item}</span>
                </div>
              ))}
              <div className="audience-special">
                <svg className="special-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 8v4"/>
                  <path d="M12 16h.01"/>
                </svg>
                <span>Anyone who feels they are capable of far more than they are currently experiencing.</span>
              </div>
            </div>
          </div>

          {/* Problems Solved */}
          <div 
            className="card card-premium"
            ref={el => cardsRef.current[4] = el}
          >
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </span>
                Patterns You May Recognise
              </h2>
              <div className="card-accent"></div>
            </div>
            <div className="problems-grid">
              {aboutData.problems.map((problem, index) => (
                <div key={index} className="problem-item">
                  <div className="problem-icon-wrapper">
                    <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <span className="problem-text">{problem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Not Suitable For */}
        <div 
          className="card card-premium card-warning"
          ref={el => cardsRef.current[5] = el}
        >
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon warning-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </span>
              This Webinar Is <span className="not-text">NOT</span> Suitable For
            </h2>
            <div className="card-accent warning-accent"></div>
          </div>
          <div className="not-suitable-grid">
            {aboutData.notSuitable.map((item, index) => (
              <div key={index} className="not-suitable-item">
                <div className="not-icon-wrapper">
                  <svg className="not-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <span className="not-text-content">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics / Impact Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">2</div>
            <div className="stat-label">Transformational Days</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">7</div>
            <div className="stat-label">Key Topics Covered</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">5</div>
            <div className="stat-label">Learning Outcomes</div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="cta-section">
          <div className="cta-content">
            <div className="cta-text">
              <h3>{aboutData.ctaTitle}</h3>
              <p>{aboutData.ctaText}</p>
            </div>
            <Link to="/register" className="cta-button">
              <span>{aboutData.ctaButton}</span>
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          <p className="cta-subtext">
            Limited spots available • Secure your seat today
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
