import { useState, useEffect } from 'react';
import api from '../../api';
import './HomeAdmin.css';

const HomeAdmin = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    time: '',
    duration: '',
    language: '',
    platform: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [webinarData, setWebinarData] = useState(null);

  useEffect(() => {
    fetchWebinarData();
  }, []);

  const fetchWebinarData = async () => {
    try {
      const response = await api.get('/webinar');
      if (response.data.success && response.data.data) {
        setWebinarData(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching webinar data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSend.append('backgroundImage', imageFile);
      }

      const response = await api.put('/webinar', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Webinar data updated successfully!' });
        fetchWebinarData();
        setImageFile(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update webinar data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-admin">
      <div className="admin-header">
        <h1>Manage Home Page</h1>
        <p>Update webinar details and background image</p>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Webinar Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Enter webinar title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subtitle">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleInputChange}
                placeholder="Enter subtitle"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Webinar Date</label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date || ''}
                onChange={handleInputChange}
                placeholder="e.g., December 25, 2024"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time || ''}
                onChange={handleInputChange}
                placeholder="e.g., 10:00 AM - 6:00 PM"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                placeholder="e.g., 2 Hours / Day"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <input
                type="text"
                id="language"
                name="language"
                value={formData.language || ''}
                onChange={handleInputChange}
                placeholder="e.g., English"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="platform">Platform</label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={formData.platform || ''}
                onChange={handleInputChange}
                placeholder="e.g., Zoom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="e.g., 249"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image">Background Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="form-hint">
                Leave empty to keep current image
              </small>
            </div>
            {webinarData?.backgroundImage && (
              <div className="form-group">
                <label>Current Image</label>
                <img 
                  src={webinarData.backgroundImage} 
                  alt="Current background" 
                  className="current-image-preview"
                />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Webinar Data'}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        <h3>Live Preview</h3>
        <div className="preview-container">
          <div className="preview-card">
            <h4>{formData.title || 'The Abundance Crossroad™'}</h4>
            <p>{formData.subtitle || 'Preview of webinar subtitle'}</p>
            <div className="preview-details">
              <span>📅 {formData.date || 'Date'}</span>
              <span>⏰ {formData.time || 'Time'}</span>
              <span>💬 {formData.language || 'Language'}</span>
              <span>💻 {formData.platform || 'Platform'}</span>
              <span>💰 ₹{formData.price || '0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
