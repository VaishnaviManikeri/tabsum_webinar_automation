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
  const [imageMode, setImageMode] = useState('url');

  useEffect(() => {
    api.get(`/sections/${slug}`).then(({ data }) => {
      if (data.data) {
        setExists(true);
        setForm({ ...defaults, ...data.data });
        if (slug === 'speaker') setImageMode(data.data.image?.startsWith('data:image') ? 'upload' : 'url');
      }
    }).catch(error => setMessage({ type: 'error', text: error.response?.data?.message || `Could not load ${label}` }));
  }, [slug, label, defaults]);

  const change = ({ target: { name, value } }) => setForm(current => ({ ...current, [name]: value }));

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Please choose an image smaller than 7MB.' });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm(current => ({ ...current, image: reader.result }));
      setImageMode('upload');
    };
    reader.readAsDataURL(file);
  };

  const save = async event => {
    event.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    try {
      const response = exists ? await api.put(`/sections/${slug}`, form) : await api.post(`/sections/${slug}`, form);
      if (response.data.data) setForm(current => ({ ...current, ...response.data.data }));
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
      {Object.entries(form).filter(([key]) => !['id','slug','createdAt','updatedAt','textColor','backgroundColor','fontFamily','fontSize'].includes(key)).map(([key, value]) => {
        const lowerKey = key.toLowerCase();
        const textareaRows = lowerKey.includes('description') || lowerKey.includes('bio') || lowerKey.includes('quote') ? 5 : 2;
        const isImageField = lowerKey === 'image' || lowerKey === 'img' || lowerKey.includes('image');

        return <div className="form-group" key={key}>
          <label htmlFor={`${slug}-${key}`}>{key.replace(/([A-Z])/g, ' $1')}</label>
          {isImageField && slug === 'speaker' ? (
            <>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="radio" name={`${slug}-image-source`} checked={imageMode === 'url'} onChange={() => { setImageMode('url'); setForm(current => ({ ...current, image: '' })); }} />
                  Use image URL
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="radio" name={`${slug}-image-source`} checked={imageMode === 'upload'} onChange={() => { setImageMode('upload'); setForm(current => ({ ...current, image: '' })); }} />
                  Upload image
                </label>
              </div>

              {imageMode === 'url' ? (
                <input id={`${slug}-${key}`} name={key} type="url" value={typeof value === 'string' && value.startsWith('data:image') ? '' : (value ?? '')} onChange={(event) => {
                  const nextValue = event.target.value;
                  setForm(current => ({ ...current, image: nextValue }));
                  setImageMode('url');
                }} placeholder="https://example.com/image.jpg" required />
              ) : (
                <>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  {typeof value === 'string' && value.startsWith('data:image') ? (
                    <img src={value} alt="Upload preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginTop: '0.8rem', display: 'block' }} />
                  ) : null}
                </>
              )}
            </>
          ) : isImageField ? (
            <input id={`${slug}-${key}`} name={key} type="url" value={value ?? ''} onChange={change} placeholder="https://example.com/image.jpg" />
          ) : ['textColor', 'backgroundColor'].includes(key) ? (
            <input id={`${slug}-${key}`} name={key} type="color" value={value || '#ffffff'} onChange={change} />
          ) : key === 'fontFamily' ? (
            <select id={`${slug}-${key}`} name={key} value={value || 'Inter'} onChange={change}>
              {['Inter', 'Poppins', 'Montserrat', 'Lora', 'Merriweather', 'Playfair Display', 'Georgia', 'Arial'].map(font => <option value={font} key={font}>{font}</option>)}
            </select>
          ) : key === 'fontSize' ? (
            <input id={`${slug}-${key}`} name={key} type="number" min="10" max="32" step="1" value={value || '16'} onChange={change} />
          ) : (
            <textarea id={`${slug}-${key}`} name={key} rows={textareaRows} value={value ?? ''} onChange={change} required />
          )}
        </div>;
      })}
      <div className="form-group">
        <label htmlFor={`${slug}-textColor`}>Section text color</label>
        <input id={`${slug}-textColor`} name="textColor" type="color" value={form.textColor || '#0f172a'} onChange={change} />
      </div>
      <div className="about-admin-actions"><button className="submit-btn" disabled={loading}>{loading ? 'Saving...' : exists ? `Update ${label}` : `Create ${label}`}</button>{exists && <button type="button" className="delete-about-btn" onClick={remove}>Delete Content</button>}</div>
    </form></div>
  </div>;
};
export default SectionAdmin;
