import { useEffect, useState } from 'react';
import api from '../../api';
import './HomeAdmin.css';
import './AboutAdmin.css';

const emptyForm = {
  badge: 'The Crossroad 2026',
  title: 'About the Experience',
  subtitle: 'A private invitation to the decision that could change what comes next',
  leadText: 'Some decisions shape everything. Others quietly shape the life you will live.',
  description: 'The question is rarely whether you are capable of more. It is whether you are ready to see what has been influencing your choices.',
  highlightText: 'The Abundance Crossroad™ is a two-day experience for people standing at a meaningful turning point.',
  topics: [], outcomes: [], audience: [], problems: [], notSuitable: [],
  ctaTitle: 'What could one better decision make possible?',
  ctaText: 'Join us at the Abundance Crossroad™ and discover the path to clarity, confidence, and success.',
  ctaButton: 'Enter the Crossroad'
};

const listFields = ['topics', 'outcomes', 'audience', 'problems', 'notSuitable'];

const AboutAdmin = () => {
  const [recordId, setRecordId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadAbout = async () => {
    try {
      const response = await api.get('/about');
      const record = response.data.data?.[0];
      if (record) {
        setRecordId(record.id);
        setForm({ ...emptyForm, ...record });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not load About content' });
    }
  };

  useEffect(() => { loadAbout(); }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(current => ({
      ...current,
      [name]: listFields.includes(name) ? value.split('\n').filter(Boolean) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = recordId
        ? await api.put(`/about/${recordId}`, form)
        : await api.post('/about', form);
      setRecordId(response.data.data.id);
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not save About content' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId || !window.confirm('Delete the saved About content? The public page will use its defaults.')) return;
    try {
      await api.delete(`/about/${recordId}`);
      setRecordId(null);
      setForm(emptyForm);
      setMessage({ type: 'success', text: 'About content deleted' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not delete About content' });
    }
  };

  const textFields = [
    ['badge', 'Badge'], ['title', 'Title'], ['subtitle', 'Subtitle'],
    ['leadText', 'Lead text'], ['description', 'Description'], ['highlightText', 'Highlight text'],
    ['ctaTitle', 'CTA title'], ['ctaText', 'CTA text'], ['ctaButton', 'CTA button']
  ];

  return (
    <div className="home-admin about-admin">
      <div className="admin-header"><h1>Manage About Page</h1><p>Edit the public About experience and its content lists.</p></div>
      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}
      <div className="admin-form-container">
        <form className="admin-form" onSubmit={handleSubmit}>
          {textFields.map(([name, label]) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <textarea id={name} name={name} rows={name.includes('Text') || name === 'description' ? 3 : 2} value={form[name]} onChange={handleChange} required />
            </div>
          ))}
          {listFields.map(name => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{name.replace(/([A-Z])/g, ' $1')} — one item per line</label>
              <textarea id={name} name={name} rows="6" value={(form[name] || []).join('\n')} onChange={handleChange} />
            </div>
          ))}
          <div className="about-admin-actions">
            <button className="submit-btn" disabled={loading}>{loading ? 'Saving...' : recordId ? 'Update About Page' : 'Create About Page'}</button>
            {recordId && <button type="button" className="delete-about-btn" onClick={handleDelete}>Delete Content</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutAdmin;
