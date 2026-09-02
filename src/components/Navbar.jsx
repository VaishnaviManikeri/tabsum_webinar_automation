import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('siteTheme') || 'light');
  const [onHome, setOnHome] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('siteTheme', theme);
  }, [theme]);

  useEffect(() => {
    const updateNavbarTone = () => {
      const home = document.getElementById('home');
      setOnHome(home ? window.scrollY < home.offsetTop + home.offsetHeight - 90 : false);
    };
    updateNavbarTone();
    window.addEventListener('scroll', updateNavbarTone, { passive: true });
    window.addEventListener('resize', updateNavbarTone);
    return () => {
      window.removeEventListener('scroll', updateNavbarTone);
      window.removeEventListener('resize', updateNavbarTone);
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Webinar', href: '#about' },
    { name: 'Speaker', href: '#speaker' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Agenda', href: '#agenda' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Register', href: '/register' },
  ];

  return (
    <nav className={`navbar ${onHome ? 'navbar-home' : 'navbar-scrolled'} ${theme === 'dark' ? 'navbar-dark' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <a href="#home">Infinite <span>Blessing</span></a>
        </div>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.name}>
              {item.name === 'Register' ? <Link
                to={item.href}
                className={item.name === 'Register' ? 'register-btn' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link> : <a href={item.href} onClick={() => setIsMenuOpen(false)}>{item.name}</a>}
            </li>
          ))}
        </ul>

        <button className="theme-toggle" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
