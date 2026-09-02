import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Speaker from './components/Speaker';
import Benifits from './components/Benifits';
import Agenda from './components/Agenda';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
// import FAQ from './components/FAQ';
// import Register from './components/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoutes from './pages/admin/ProtectedRoutes';
import Registration from './pages/Registration';
import { useEffect } from 'react';
import api from './api';
import './App.css';
import './PublicOverrides.css';

function App() {
  useEffect(() => {
    api.get('/settings/typography').then(({ data }) => {
      const root = document.documentElement;
      const scales = {
        compact: { h1: 'clamp(1.75rem, 3.4vw, 2.7rem)', h2: 'clamp(1.3rem, 2.2vw, 1.9rem)', sub: 'clamp(.82rem, 1.25vw, 1.02rem)', body: '.84rem' },
        balanced: { h1: 'clamp(2rem, 3.8vw, 3.25rem)', h2: 'clamp(1.45rem, 2.5vw, 2.2rem)', sub: 'clamp(.9rem, 1.45vw, 1.18rem)', body: '.9rem' },
        large: { h1: 'clamp(2.35rem, 4.5vw, 3.9rem)', h2: 'clamp(1.7rem, 3vw, 2.65rem)', sub: 'clamp(1rem, 1.7vw, 1.38rem)', body: '1rem' }
      };
      const headingScale = scales[data.data.headingSize || 'balanced'];
      const subheadingScale = scales[data.data.subheadingSize || 'balanced'];
      const bodyScale = scales[data.data.bodySize || 'balanced'];
      root.style.setProperty('--font-heading', `'${data.data.headingFont}', serif`);
      root.style.setProperty('--font-subheading', `'${data.data.subheadingFont}', sans-serif`);
      root.style.setProperty('--font-body', `'${data.data.bodyFont}', sans-serif`);
      root.style.setProperty('--font-h1-size', headingScale.h1);
      root.style.setProperty('--font-h2-size', headingScale.h2);
      root.style.setProperty('--font-subheading-size', subheadingScale.sub);
      root.style.setProperty('--font-body-size', bodyScale.body);
    }).catch(() => {});
  }, []);
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="app app-shell">
            <Navbar />
            <section id="home">
              <Home />
            </section>
            <section id="about">
              <About />
            </section>
            <section id="speaker"><Speaker /></section>
            <section id="benefits"><Benifits /></section>
            <section id="agenda"><Agenda /></section>
            <section id="testimonials"><Testimonials /></section>
            <section id="cta"><CTA /></section>
            {/* <section id="faq"><FAQ /></section> */}
            {/* <section id="register"><Register /></section> */}

            <Footer />
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Registration />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        </Route>

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
