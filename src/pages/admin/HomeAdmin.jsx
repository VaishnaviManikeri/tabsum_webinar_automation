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
    zoomMeetingId: '',
    zoomJoinUrl: '',
    zoomStartUrl: '',
    zoomPassword: '',
  });

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: ''
  });

  const [webinarData, setWebinarData] = useState(null);
  const [homeAppearance, setHomeAppearance] = useState(() => {
    try {
      return { textColor: '#ffffff', ...JSON.parse(localStorage.getItem('homeAppearance') || '{}') };
    } catch {
      return { textColor: '#ffffff' };
    }
  });

  // =========================================================
  // FETCH WEBINAR
  // =========================================================

  useEffect(() => {
    fetchWebinarData();
  }, []);

  const fetchWebinarData = async () => {
    try {
      const response = await api.get('/webinar');

      if (
        response.data.success &&
        response.data.data
      ) {
        const webinar = response.data.data;

        console.log(
          'Webinar loaded:',
          webinar
        );

        console.log(
          'Webinar ID:',
          webinar.id
        );

        setWebinarData(webinar);

        setFormData({
          title: webinar.title || '',
          subtitle: webinar.subtitle || '',
          date: webinar.date || '',
          time: webinar.time || '',
          duration: webinar.duration || '',
          language: webinar.language || '',
          platform: webinar.platform || '',
          price:
            webinar.price !== null &&
            webinar.price !== undefined
              ? webinar.price
              : '',
          zoomMeetingId: webinar.zoom_meeting_id || '',
          zoomJoinUrl: webinar.zoom_join_url || '',
          zoomStartUrl: webinar.zoom_start_url || '',
          zoomPassword: webinar.zoom_password || ''
        });
      }
    } catch (error) {
      console.error(
        'Error fetching webinar data:',
        error
      );

      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to fetch webinar data'
      });
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTextColorChange = (event) => {
    const nextAppearance = { ...homeAppearance, textColor: event.target.value };
    setHomeAppearance(nextAppearance);
    localStorage.setItem('homeAppearance', JSON.stringify(nextAppearance));
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // =========================================================
  // UPDATE WEBINAR
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      type: '',
      text: ''
    });

    try {
      // -------------------------------------------------------
      // Validate webinar ID
      // -------------------------------------------------------

      if (
        !webinarData?.id
      ) {
        setMessage({
          type: 'error',
          text:
            'Webinar ID is missing. Please refresh the page.'
        });

        return;
      }

      const webinarId =
        Number(webinarData.id);

      if (
        !Number.isInteger(webinarId) ||
        webinarId <= 0
      ) {
        setMessage({
          type: 'error',
          text:
            'Invalid webinar ID. Please refresh the page.'
        });

        return;
      }

      console.log(
        'Updating webinar ID:',
        webinarId
      );

      // -------------------------------------------------------
      // Create FormData
      // -------------------------------------------------------

      const formDataToSend =
        new FormData();

      formDataToSend.append(
        'title',
        formData.title
      );

      formDataToSend.append(
        'subtitle',
        formData.subtitle
      );

      formDataToSend.append(
        'date',
        formData.date
      );

      formDataToSend.append(
        'time',
        formData.time
      );

      formDataToSend.append(
        'duration',
        formData.duration
      );

      formDataToSend.append(
        'language',
        formData.language
      );

      formDataToSend.append(
        'platform',
        formData.platform
      );

      formDataToSend.append(
        'price',
        formData.price
      );

      formDataToSend.append(
        'zoomMeetingId',
        formData.zoomMeetingId
      );

      formDataToSend.append(
        'zoomJoinUrl',
        formData.zoomJoinUrl
      );

      formDataToSend.append(
        'zoomStartUrl',
        formData.zoomStartUrl
      );

      formDataToSend.append(
        'zoomPassword',
        formData.zoomPassword
      );

      // -------------------------------------------------------
      // Add image only when selected
      // -------------------------------------------------------

      if (imageFile) {
        formDataToSend.append(
          'backgroundImage',
          imageFile
        );
      }

      // -------------------------------------------------------
      // UPDATE API
      // -------------------------------------------------------

      const response =
        await api.put(
          `/webinar/${webinarId}`,
          formDataToSend
        );

      console.log(
        'Update webinar response:',
        response.data
      );

      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      if (
        response.data.success
      ) {
        setMessage({
          type: 'success',
          text:
            'Webinar data updated successfully!'
        });

        // Clear selected image
        setImageFile(null);

        // Refresh webinar data
        await fetchWebinarData();
      } else {
        setMessage({
          type: 'error',
          text:
            response.data.message ||
            'Failed to update webinar data'
        });
      }

    } catch (error) {
      console.error(
        'Update webinar error:',
        error
      );

      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to update webinar data'
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="home-admin">

      <div className="admin-header">
        <h1>
          Manage Home Page
        </h1>

        <p>
          Update webinar details and background image
        </p>
      </div>

      {message.text && (
        <div
          className={`admin-message ${message.type}`}
        >
          {message.text}
        </div>
      )}

      <div className="admin-form-container">

        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >

          {/* ================================================= */}
          {/* TITLE + SUBTITLE */}
          {/* ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="title">
                Webinar Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={
                  formData.title || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="Enter webinar title"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="subtitle">
                Subtitle
              </label>

              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={
                  formData.subtitle || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="Enter subtitle"
                required
              />

            </div>

          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="home-text-color">Home page text color</label>
              <div className="color-input-wrap">
                <input id="home-text-color" type="color" value={homeAppearance.textColor} onChange={handleTextColorChange} />
                <span>{homeAppearance.textColor}</span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* DATE + TIME */}
          {/* ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="date">
                Webinar Date
              </label>

              <input
                type="text"
                id="date"
                name="date"
                value={
                  formData.date || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g., 2026-09-25"
                required
              />

              <small className="form-hint">
                Format: YYYY-MM-DD
              </small>

            </div>

            <div className="form-group">

              <label htmlFor="time">
                Time
              </label>

              <input
                type="text"
                id="time"
                name="time"
                value={
                  formData.time || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g., 10:00 AM - 12:00 PM"
                required
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* DURATION + LANGUAGE */}
          {/* ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="duration">
                Duration
              </label>

              <input
                type="text"
                id="duration"
                name="duration"
                value={
                  formData.duration || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g., 2 Hours / Day"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="language">
                Language
              </label>

              <input
                type="text"
                id="language"
                name="language"
                value={
                  formData.language || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g., English"
                required
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* PLATFORM + PRICE */}
          {/* ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="platform">
                Platform
              </label>

              <input
                type="text"
                id="platform"
                name="platform"
                value={
                  formData.platform || ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g., Zoom"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="price">
                Price (₹)
              </label>

              <input
                type="number"
                id="price"
                name="price"
                value={
                  formData.price ?? ''
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g., 249"
                min="0"
                step="0.01"
                required
              />

              <small className="form-hint">
                This price will be used for new Razorpay orders.
              </small>

            </div>

          </div>

          {/* ================================================= */}
          {/* ZOOM ACCESS DETAILS */}
          {/* ================================================= */}

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="zoomJoinUrl">
                Participant Zoom Link
              </label>

              <input
                type="url"
                id="zoomJoinUrl"
                name="zoomJoinUrl"
                value={formData.zoomJoinUrl || ''}
                onChange={handleInputChange}
                placeholder="https://zoom.us/j/..."
              />

              <small className="form-hint">
                This current link is included in paid confirmation and reminder messages.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="zoomMeetingId">
                Zoom Meeting ID
              </label>

              <input
                type="text"
                id="zoomMeetingId"
                name="zoomMeetingId"
                value={formData.zoomMeetingId || ''}
                onChange={handleInputChange}
                placeholder="e.g., 123 456 7890"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="zoomStartUrl">
                Host Start Link (optional)
              </label>

              <input
                type="url"
                id="zoomStartUrl"
                name="zoomStartUrl"
                value={formData.zoomStartUrl || ''}
                onChange={handleInputChange}
                placeholder="https://zoom.us/s/..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="zoomPassword">
                Zoom Password (optional)
              </label>

              <input
                type="text"
                id="zoomPassword"
                name="zoomPassword"
                value={formData.zoomPassword || ''}
                onChange={handleInputChange}
                placeholder="Meeting password"
              />
            </div>

          </div>

          {/* ================================================= */}
          {/* BACKGROUND IMAGE */}
          {/* ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="image">
                Background Image
              </label>

              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

              <small className="form-hint">
                Leave empty to keep current image
              </small>

              {imageFile && (
                <small className="form-hint">
                  Selected: {imageFile.name}
                </small>
              )}

            </div>

            {webinarData?.backgroundImage && (
              <div className="form-group">

                <label>
                  Current Image
                </label>

                <img
                  src={
                    webinarData.backgroundImage
                  }
                  alt="Current webinar background"
                  className="current-image-preview"
                />

              </div>
            )}

          </div>

          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading ||
              !webinarData?.id
            }
          >
            {loading
              ? 'Updating...'
              : 'Update Webinar Data'}
          </button>

        </form>

      </div>

      {/* ===================================================== */}
      {/* PREVIEW */}
      {/* ===================================================== */}

      <div className="preview-section">

        <h3>
          Live Preview
        </h3>

        <div className="preview-container">

          <div className="preview-card">

            <h4>
              {formData.title ||
                'The Abundance Crossroad™'}
            </h4>

            <p>
              {formData.subtitle ||
                'Preview of webinar subtitle'}
            </p>

            <div className="preview-details">

              <span>
                📅 {formData.date || 'Date'}
              </span>

              <span>
                ⏰ {formData.time || 'Time'}
              </span>

              <span>
                💬 {formData.language || 'Language'}
              </span>

              <span>
                💻 {formData.platform || 'Platform'}
              </span>

              <span>
                💰 ₹{formData.price || '0'}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HomeAdmin;