import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLayerGroup,
  FaMicrophone,
  FaGift,
  FaListAlt,
  FaComments,
  FaBullhorn,
  FaFont,
  FaUsers,
  FaClipboardList,
} from 'react-icons/fa';
import HomeAdmin from './HomeAdmin';
import AboutAdmin from './AboutAdmin';
import SectionAdmin from './SectionAdmin';
import { sectionDefaults } from '../../contentDefaults';
import TypographyAdmin from './TypographyAdmin';
import './AdminDashboard.css';
import CRMDashboard from './CRMDashboard';
import RegistrationsAdmin from './RegistrationsAdmin';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><FaLayerGroup /></div>
          <div><strong>Crossroad</strong><span>Content Studio</span></div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><FaTimes /></button>
        </div>
        
        <div className="sidebar-label">Workspace</div>
        <div className="sidebar-label webinar-management-label">
  Webinar Management
</div>

<NavLink
  to="/admin/dashboard/crm"
  onClick={() => setSidebarOpen(false)}
  className={({ isActive }) =>
    `sidebar-link ${isActive ? 'active' : ''}`
  }
>
  <FaUsers />
  <span>CRM Dashboard</span>
</NavLink>

<NavLink
  to="/admin/dashboard/registrations"
  onClick={() => setSidebarOpen(false)}
  className={({ isActive }) =>
    `sidebar-link ${isActive ? 'active' : ''}`
  }
>
  <FaClipboardList />
  <span>Registrations</span>
</NavLink>
        <nav className="sidebar-links">
          <NavLink to="/admin/dashboard" end onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaHome /><span>Home Page</span></NavLink>
          <NavLink to="/admin/dashboard/about" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaInfoCircle /><span>About Page</span></NavLink>
          <NavLink to="/admin/dashboard/speaker" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaMicrophone /><span>Speaker</span></NavLink>
          <NavLink to="/admin/dashboard/benefits" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaGift /><span>Benefits</span></NavLink>
          <NavLink to="/admin/dashboard/agenda" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaListAlt /><span>Agenda</span></NavLink>
          <NavLink to="/admin/dashboard/testimonials" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaComments /><span>Testimonials</span></NavLink>
          <NavLink to="/admin/dashboard/cta" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaBullhorn /><span>Final CTA</span></NavLink>
          <NavLink to="/admin/dashboard/typography" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaFont /><span>Typography</span></NavLink>
          
        </nav>
        <div className="sidebar-label">
  Webinar Management
</div>

<nav className="sidebar-links">

  <NavLink
    to="/admin/dashboard/crm"
    onClick={() => setSidebarOpen(false)}
    className={({ isActive }) =>
      `sidebar-link ${isActive ? 'active' : ''}`
    }
  >
    <FaUsers />
    <span>CRM Dashboard</span>
  </NavLink>

</nav>
        <div className="sidebar-footer">
          <div className="admin-profile"><div className="profile-avatar">A</div><div><strong>Administrator</strong><span>Content manager</span></div></div>
          <button onClick={handleLogout} className="sidebar-logout"><FaSignOutAlt /><span>Sign out</span></button>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar overlay" />}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><FaBars /></button>
          <div><span className="topbar-eyebrow">Administration</span><h2>Website Content</h2></div>
          <button onClick={handleLogout} className="topbar-logout"><FaSignOutAlt /> Logout</button>
        </header>
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<HomeAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="speaker" element={<SectionAdmin slug="speaker" label="Speaker" defaults={sectionDefaults.speaker} />} />
            <Route path="benefits" element={<SectionAdmin slug="benefits" label="Benefits" defaults={sectionDefaults.benefits} />} />
            <Route path="agenda" element={<SectionAdmin slug="agenda" label="Agenda" defaults={sectionDefaults.agenda} />} />
            <Route path="testimonials" element={<SectionAdmin slug="testimonials" label="Testimonials" defaults={sectionDefaults.testimonials} />} />
            <Route path="cta" element={<SectionAdmin slug="cta" label="Final CTA" defaults={sectionDefaults.cta} />} />
            <Route path="typography" element={<TypographyAdmin />} />
            <Route
  path="crm"
  element={<CRMDashboard />}
/>
            <Route
  path="registrations"
  element={<RegistrationsAdmin />}
/>
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
