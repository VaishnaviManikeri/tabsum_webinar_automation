import { useEffect, useState } from 'react';
import api from '../../api';
import './HomeAdmin.css';
import './TypographyAdmin.css';

const fontOptions = ['Playfair Display', 'Inter', 'Poppins', 'Montserrat', 'Lora', 'Merriweather', 'Georgia', 'Arial'];
const sizeOptions = [['compact', 'Compact'], ['balanced', 'Balanced'], ['large', 'Large']];
const sizeScales = {
  compact: { h1: 'clamp(2rem, 4vw, 3.25rem)', h2: 'clamp(1.5rem, 2.6vw, 2.25rem)', sub: 'clamp(.95rem, 1.5vw, 1.2rem)', body: '.92rem' },
  balanced: { h1: 'clamp(2.4rem, 4.5vw, 4rem)', h2: 'clamp(1.75rem, 3vw, 2.75rem)', sub: 'clamp(1rem, 1.8vw, 1.45rem)', body: '1rem' },
  large: { h1: 'clamp(2.8rem, 5.2vw, 4.8rem)', h2: 'clamp(2rem, 3.5vw, 3.25rem)', sub: 'clamp(1.1rem, 2vw, 1.65rem)', body: '1.1rem' }
};
const applyTypography = ({ headingFont, headingSize = 'balanced', subheadingFont, subheadingSize = 'balanced', bodyFont, bodySize = 'balanced' }) => {
  const root = document.documentElement;
  root.style.setProperty('--font-heading', `'${headingFont}', serif`);
  root.style.setProperty('--font-subheading', `'${subheadingFont}', sans-serif`);
  root.style.setProperty('--font-body', `'${bodyFont}', sans-serif`);
  root.style.setProperty('--font-h1-size', sizeScales[headingSize].h1);
  root.style.setProperty('--font-h2-size', sizeScales[headingSize].h2);
  root.style.setProperty('--font-subheading-size', sizeScales[subheadingSize].sub);
  root.style.setProperty('--font-body-size', sizeScales[bodySize].body);
};

const TypographyAdmin = () => {
  const [form, setForm] = useState({ headingFont: 'Playfair Display', headingSize: 'balanced', subheadingFont: 'Inter', subheadingSize: 'balanced', bodyFont: 'Inter', bodySize: 'balanced' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  useEffect(() => { api.get('/settings/typography').then(({ data }) => { setForm(data.data); applyTypography(data.data); }); }, []);
  const change = event => { const next = { ...form, [event.target.name]: event.target.value }; setForm(next); applyTypography(next); };
  const save = async event => { event.preventDefault(); setLoading(true); try { const { data } = await api.put('/settings/typography', form); applyTypography(data.data); setMessage({ type: 'success', text: 'Typography applied across the website' }); } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Could not save typography' }); } finally { setLoading(false); } };
  return <div className="home-admin typography-admin">
    <div className="admin-header"><h1>Website Typography</h1><p>Choose a coordinated font family for each text category.</p></div>
    {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}
    <form className="typography-panel" onSubmit={save}>
      {[['headingFont','headingSize','Headings','Used for H1 and H2 display titles.'],['subheadingFont','subheadingSize','Subheadings','Used for H3, H4, labels and navigation.'],['bodyFont','bodySize','Paragraphs','Used for paragraphs, lists, inputs and supporting copy.']].map(([name,sizeName,label,help]) => <div className="font-category" key={name}>
        <div><span className="font-category-index">{name === 'headingFont' ? '01' : name === 'subheadingFont' ? '02' : '03'}</span><h2>{label}</h2><p>{help}</p></div>
        <select name={name} value={form[name]} onChange={change}>{fontOptions.map(font => <option value={font} key={font}>{font}</option>)}</select>
        <select name={sizeName} value={form[sizeName]} onChange={change} aria-label={`${label} size`}>{sizeOptions.map(([value,text]) => <option value={value} key={value}>{text} size</option>)}</select>
        <div className={`font-preview preview-${form[sizeName]}`} style={{ fontFamily: `'${form[name]}'` }}><small>Live preview</small>{name === 'headingFont' ? <strong>One Better Decision</strong> : name === 'subheadingFont' ? <strong>A meaningful crossroad awaits</strong> : <span>Clarity begins when you see the patterns behind your choices.</span>}</div>
      </div>)}
      <button className="submit-btn" disabled={loading}>{loading ? 'Applying...' : 'Save & Apply Typography'}</button>
    </form>
  </div>;
};
export default TypographyAdmin;
