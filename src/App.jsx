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
import AttendanceDashboard from './pages/admin/AttendanceDashboard';
import ProtectedRoutes from './pages/admin/ProtectedRoutes';
import Registration from './RegistrationPostPayment';
import ThankYou from './ThankYouPage';
import './App.css';
import './PublicOverrides.css';
import './ReferenceTheme.css';
import './LuxuryTheme.css';
import './SectionSpacing.css';

function App() {
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
        <Route path="/thank-you" element={<ThankYou />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin/dashboard/attendance" element={<AttendanceDashboard />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        </Route>

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
