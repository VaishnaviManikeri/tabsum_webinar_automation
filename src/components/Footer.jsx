import { FaArrowUp, FaCalendarCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const footerLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Webinar', href: '#about' },
  { name: 'Speaker', href: '#speaker' },
  { name: 'Benefits', href: '#benefits' },
  { name: 'Agenda', href: '#agenda' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
];

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-glow" aria-hidden="true" />
    <div className="footer-container">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="footer-logo" href="#home" aria-label="Infinite Blessing home">
            Infinite <span>Blessing</span>
          </a>
          <p>Practical ideas, expert guidance, and the right next steps—all in one focused webinar experience.</p>
          <Link className="footer-register" to="/register">
            <FaCalendarCheck aria-hidden="true" /> Register now
          </Link>
        </div>

        <nav className="footer-navigation" aria-label="Footer navigation">
          <p className="footer-heading">Explore</p>
          <ul>
            {footerLinks.map((item) => <li key={item.name}><a href={item.href}>{item.name}</a></li>)}
          </ul>
        </nav>

        <div className="footer-invitation">
          <p className="footer-heading">Ready to begin?</p>
          <p>Reserve your place and take the first step toward what comes next.</p>
          <Link to="/register">Save my seat <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Abundance Crossroad. All rights reserved.</p>
        <p>Choose what comes next.</p>
        <a className="back-to-top" href="#home" aria-label="Back to top"><FaArrowUp aria-hidden="true" /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
