import { useEffect, useState } from 'react';
import { FaBell, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import api from '../../api';
import './NotificationTemplatesAdmin.css';

const messageTypes = [
  ['confirmation', 'Registration confirmation'],
  ['reminder_24h', '24-hour reminder'],
  ['reminder_3h', '3-hour reminder'],
  ['reminder_30m', '30-minute reminder']
];

const emptyTemplate = {
  channel: 'email',
  message_type: 'confirmation',
  template_name: '',
  language_code: 'en_US',
  subject: '',
  body: '',
  is_active: true
};

const exampleTemplates = {
  email: {
    subject: 'Your webinar registration is confirmed',
    body: 'Hello Participant,\n\nYour registration for The Abundance Crossroad is confirmed.\n\nYour webinar details and joining link are included below.\n\nWe look forward to seeing you.'
  },
  whatsapp: {
    template_name: 'registration_confirmation',
    language_code: 'en_US',
    body: 'Hello Participant, your registration for The Abundance Crossroad is confirmed. Your webinar details are ready.'
  }
};

const labelForType = type =>
  messageTypes.find(([value]) => value === type)?.[1] || type;

const NotificationTemplatesAdmin = () => {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyTemplate);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadTemplates = async () => {
    try {
      const response = await api.get('/notification-templates');
      setTemplates(response.data?.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not load notification templates' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const change = event => {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const edit = template => {
    setEditingId(template.id);
    setForm({ ...template });
    setMessage({ type: '', text: '' });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyTemplate);
  };

  const loadExample = () => {
    setEditingId(null);
    setForm(current => ({
      ...emptyTemplate,
      channel: current.channel,
      message_type: current.message_type,
      ...exampleTemplates[current.channel]
    }));
    setMessage({ type: '', text: 'Example loaded. Review it, then save it as a new template.' });
  };

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = editingId
        ? await api.put(`/notification-templates/${editingId}`, form)
        : await api.post('/notification-templates', form);
      setMessage({ type: 'success', text: response.data.message });
      reset();
      await loadTemplates();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not save notification template' });
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async template => {
    if (!window.confirm(`Deactivate ${labelForType(template.message_type)} ${template.channel} template?`)) return;
    try {
      const response = await api.delete(`/notification-templates/${template.id}`);
      setMessage({ type: 'success', text: response.data.message });
      if (editingId === template.id) reset();
      await loadTemplates();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not deactivate template' });
    }
  };

  return (
    <section className="notification-templates-admin">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow"><FaBell /> Notification content</span>
          <h1>Confirmation & reminders</h1>
          <p>Edit the copy used by email and approved WhatsApp templates.</p>
        </div>
        <button type="button" className="admin-secondary-button" onClick={reset}><FaPlus /> New template</button>
      </div>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      <div className="notification-template-layout">
        <div className="notification-template-list">
          <div className="template-list-header">
            <div><span>Library</span><strong>Message templates</strong></div>
            <b>{templates.length}</b>
          </div>
          {loading ? <p>Loading templates...</p> : templates.map(template => (
            <button
              type="button"
              key={template.id}
              className={`notification-template-row ${editingId === template.id ? 'selected' : ''}`}
              onClick={() => edit(template)}
            >
              <span>
                <strong>{template.channel === 'email' ? 'Email' : 'WhatsApp'}</strong>
                <small>{labelForType(template.message_type)}</small>
              </span>
              <em className={template.is_active ? 'active' : 'inactive'}>{template.is_active ? 'Active' : 'Inactive'}</em>
            </button>
          ))}
        </div>

        <form className="notification-template-form" onSubmit={save}>
          <div className="form-heading">
            <div><span>Template editor</span><h2>{editingId ? 'Edit template' : 'Create template'}</h2></div>
            <div className="form-heading-actions">
              {!editingId && <button type="button" className="example-button" onClick={loadExample}>Load example</button>}
              {editingId && <button type="button" className="icon-danger" onClick={() => deactivate(form)} title="Deactivate template"><FaTrash /></button>}
            </div>
          </div>

          <div className="template-form-grid">
            <label>Channel<select name="channel" value={form.channel} onChange={change} disabled={Boolean(editingId)}><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label>
            <label>Message type<select name="message_type" value={form.message_type} onChange={change} disabled={Boolean(editingId)}>{messageTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>

          {form.channel === 'whatsapp' && <div className="template-form-grid">
            <label>Approved Meta template name<input name="template_name" value={form.template_name || ''} onChange={change} placeholder="registration_confirmation" /></label>
            <label>Language code<input name="language_code" value={form.language_code || ''} onChange={change} placeholder="en_US" /></label>
          </div>}

          {form.channel === 'email' && <label>Email subject<input name="subject" value={form.subject || ''} onChange={change} placeholder="Registration confirmed" required /></label>}
          <label>Message copy<textarea name="body" value={form.body || ''} onChange={change} rows="9" placeholder="Write the message copy..." required /></label>
          <p className="template-helper">Keep this copy concise. Email content is added to the confirmation or reminder layout; WhatsApp content should match the approved Meta template.</p>
          <label className="template-active-toggle"><input type="checkbox" name="is_active" checked={Boolean(form.is_active)} onChange={change} /> Use this template for new sends</label>

          <div className="form-actions"><button type="submit" className="admin-primary-button" disabled={saving}><FaSave /> {saving ? 'Saving...' : 'Save template'}</button>{editingId && <button type="button" className="admin-secondary-button" onClick={reset}>Cancel</button>}</div>
        </form>
      </div>
    </section>
  );
};

export default NotificationTemplatesAdmin;
