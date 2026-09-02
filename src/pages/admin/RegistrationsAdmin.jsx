import { useEffect, useState } from 'react';
import api from '../../api';

const RegistrationsAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get('/lead');
        if (response.data?.success) {
          setRegistrations(response.data.data || []);
        } else {
          setRegistrations([]);
        }
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Unable to load registrations right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <div className="admin-header"><h1>Registrations</h1><p>Loading registrations...</p></div>;
  }

  return (
    <div className="home-admin">
      <div className="admin-header">
        <h1>Registrations</h1>
        <p>All registration submissions captured from the frontend</p>
      </div>

      {error && <div className="admin-message error">{error}</div>}

      <div className="admin-form-container">
        {registrations.length === 0 ? (
          <div className="admin-message">No registrations found yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Phone</th>
                  <th style={{ padding: '12px 16px' }}>City</th>
                  <th style={{ padding: '12px 16px' }}>Role</th>
                  <th style={{ padding: '12px 16px' }}>Decision</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((item) => (
                  <tr key={item._id || `${item.email}-${item.phone}`} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{item.firstName} {item.lastName}</td>
                    <td style={{ padding: '12px 16px' }}>{item.email}</td>
                    <td style={{ padding: '12px 16px' }}>{item.phone}</td>
                    <td style={{ padding: '12px 16px' }}>{item.city || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{item.role || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{item.goal || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationsAdmin;
