/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import api from '../../api';
import './HomeAdmin.css';
import './AboutAdmin.css';

const SectionAdmin = ({ slug, label, defaults }) => {
  const [exists, setExists] = useState(false);
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get(`/sections/${slug}`).then(({ data }) => {
      if (data.data) { setExists(true); setForm({ ...defaults, ...data.data }); }
    }).catch(error => setMessage({ type: 'error', text: error.response?.data?.message || `Could not load ${label}` }));
  }, [slug, label, defaults]);

  const change = ({ target: { name, value } }) => setForm(current => ({ ...current, [name]: value }));
  const save = async event => {
    event.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    try {
      const response = exists ? await api.put(`/sections/${slug}`, form) : await api.post(`/sections/${slug}`, form);
      setExists(true); setMessage({ type: 'success', text: response.data.message });
    } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || `Could not save ${label}` }); }
    finally { setLoading(false); }
  };
  const remove = async () => {
    if (!exists || !window.confirm(`Delete saved ${label} content?`)) return;
    try { await api.delete(`/sections/${slug}`); setExists(false); setForm(defaults); setMessage({ type: 'success', text: `${label} content deleted` }); }
    catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || `Could not delete ${label}` }); }
  };

  return <div className="home-admin about-admin">
    <div className="admin-header"><h1>Manage {label}</h1><p>Update the public {label.toLowerCase()} section content.</p></div>
    {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}
    <div className="admin-form-container"><form className="admin-form" onSubmit={save}>
      {Object.entries(form).filter(([key]) => !['id','slug','createdAt','updatedAt'].includes(key)).map(([key, value]) => <div className="form-group" key={key}>
        <label htmlFor={`${slug}-${key}`}>{key.replace(/([A-Z])/g, ' $1')}</label>
        <textarea id={`${slug}-${key}`} name={key} rows={key.toLowerCase().includes('description') ? 5 : 2} value={value ?? ''} onChange={change} required />
      </div>)}
      <div className="about-admin-actions"><button className="submit-btn" disabled={loading}>{loading ? 'Saving...' : exists ? `Update ${label}` : `Create ${label}`}</button>{exists && <button type="button" className="delete-about-btn" onClick={remove}>Delete Content</button>}</div>
    </form></div>
  </div>;
};
export default SectionAdmin;
