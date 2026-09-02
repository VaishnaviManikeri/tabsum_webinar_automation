import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaLock,
  FaVideo
} from 'react-icons/fa';

import './Registration.css';

import {
  registrationAPI,
  webinarAPI
} from '../api';


const Registration = () => {

  // ==================================================
  // STATE
  // ==================================================

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [webinar, setWebinar] =
    useState(null);


  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',

    email: '',
    phone: '',

    city: '',
    role: '',

    goal: '',

    consent: false

  });


  // ==================================================
  // GET WEBINAR DETAILS
  // ==================================================

  useEffect(() => {

    const loadWebinar = async () => {

      try {

        const response =
          await webinarAPI.getAll();


        const webinarData =
          response.data?.data?.[0];


        if (webinarData) {

          setWebinar(
            webinarData
          );

        }

      } catch (error) {

        console.error(
          'Failed to load webinar:',
          error
        );

      }

    };


    loadWebinar();

  }, []);


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked
    } = event.target;


    setFormData(
      previous => ({

        ...previous,

        [name]:
          type === 'checkbox'
            ? checked
            : value

      })
    );

  };


  // ==================================================
  // HANDLE FORM SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    setError('');
    setLoading(true);


    try {

      // ----------------------------------------------
      // Send registration to backend
      // ----------------------------------------------

      const response =
        await registrationAPI.create({

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.email,

          phone:
            formData.phone,

          city:
            formData.city,

          role:
            formData.role,

          goal:
            formData.goal,

          consent:
            formData.consent,

          // If webinar exists,
          // send its ID.

          webinarId:
            webinar?.id || null,

          source:
            'Website'

        });


      // ----------------------------------------------
      // Check response
      // ----------------------------------------------

      if (response.data?.success) {

        setSubmitted(true);


        window.scrollTo({

          top: 0,

          behavior: 'smooth'

        });

      } else {

        setError(
          response.data?.message ||
          'Registration failed.'
        );

      }


    } catch (error) {

      console.error(
        'Registration error:',
        error
      );


      setError(

        error.response?.data?.message ||

        'Something went wrong. Please try again.'

      );

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // WEBINAR DISPLAY VALUES
  // ==================================================

  const webinarDate =
    webinar?.date ||
    'To be updated';


  const webinarTime =
    webinar?.time ||
    'To be updated';


  const webinarDuration =
    webinar?.duration ||
    'Two-day experience';


  const webinarPlatform =
    webinar?.platform ||
    'Zoom';


  // ==================================================
  // UI
  // ==================================================

  return (

    <main className="registration-page">

      <div
        className="registration-orb registration-orb-one"
      />

      <div
        className="registration-orb registration-orb-two"
      />


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="registration-header">

        <Link
          to="/"
          className="registration-brand"
        >
          Infinite <span>Blessing</span>
        </Link>


        <Link
          to="/"
          className="registration-back"
        >
          <FaArrowLeft />

          Back to experience

        </Link>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="registration-shell">


        {/* =================================================
            LEFT INTRO
        ================================================= */}

        <section className="registration-intro">

          <span className="registration-eyebrow">
            Your invitation
          </span>


          <h1>
            Reserve your place at the Crossroad.
          </h1>


          <p>
            One considered decision can change
            the direction of everything that follows.
            Tell us where you are now—and where
            you are ready to go.
          </p>


          {/* =================================================
              WEBINAR DETAILS
          ================================================= */}

          <div className="registration-details">


            <div>

              <FaCalendarAlt />

              <span>

                <small>
                  Date
                </small>

                {webinarDate}

              </span>

            </div>


            <div>

              <FaClock />

              <span>

                <small>
                  Time
                </small>

                {webinarTime}

              </span>

            </div>


            <div>

              <FaVideo />

              <span>

                <small>
                  Format
                </small>

                {webinarDuration}

              </span>

            </div>


            <div>

              <FaVideo />

              <span>

                <small>
                  Location
                </small>

                Live on {webinarPlatform}

              </span>

            </div>

          </div>


          {/* =================================================
              PRIVACY PROMISE
          ================================================= */}

          <div className="registration-promise">

            <FaCheckCircle />

            <span>

              <strong>
                A considered room.
              </strong>{' '}

              Your information is used only
              for this registration experience.

            </span>

          </div>

        </section>


        {/* =================================================
            REGISTRATION CARD
        ================================================= */}

        <section className="registration-card">


          {/* =================================================
              SUCCESS
          ================================================= */}

          {submitted ? (

            <div className="registration-success">

              <div className="success-icon">

                <FaCheckCircle />

              </div>


              <span>
                Registration received
              </span>


              <h2>
                Your place is being held.
              </h2>


              <p>

                Your registration has been
                successfully received.

                We will use your registered
                contact details for webinar
                communication and session updates.

              </p>


              <Link
                to="/"
                className="registration-submit"
              >

                Return to homepage

              </Link>

            </div>

          ) : (


            <>
              {/* =================================================
                  FORM HEADER
              ================================================= */}

              <div className="registration-card-header">

                <span>
                  Step 01
                </span>


                <h2>
                  Tell us about you
                </h2>


                <p>
                  All fields marked with * are required.
                </p>

              </div>


              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {error && (

                <div
                  role="alert"
                  style={{
                    marginBottom: '18px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(220, 38, 38, 0.12)',
                    border: '1px solid rgba(248, 113, 113, 0.35)',
                    color: '#fecaca',
                    fontSize: '0.9rem'
                  }}
                >

                  {error}

                </div>

              )}


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="registration-form"
              >


                {/* FIRST + LAST NAME */}

                <div className="registration-grid">

                  <label>

                    First name *

                    <input
                      name="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />

                  </label>


                  <label>

                    Last name *

                    <input
                      name="lastName"
                      type="text"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />

                  </label>

                </div>


                {/* EMAIL */}

                <label>

                  Email address *

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </label>


                {/* PHONE + CITY */}

                <div className="registration-grid">

                  <label>

                    Phone number *

                    <input
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />

                  </label>


                  <label>

                    City

                    <input
                      name="city"
                      type="text"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleChange}
                    />

                  </label>

                </div>


                {/* ROLE */}

                <label>

                  What best describes you? *

                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select your role
                    </option>


                    <option>
                      Business owner
                    </option>


                    <option>
                      Founder or entrepreneur
                    </option>


                    <option>
                      Senior leader
                    </option>


                    <option>
                      Professional
                    </option>


                    <option>
                      Coach or consultant
                    </option>


                    <option>
                      Other
                    </option>

                  </select>

                </label>


                {/* GOAL */}

                <label>

                  What decision are you standing in front?

                  <textarea
                    name="goal"
                    rows="4"
                    placeholder="Share as much or as little as feels useful..."
                    value={formData.goal}
                    onChange={handleChange}
                  />

                </label>


                {/* CONSENT */}

                <label className="registration-consent">

                  <input
                    name="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleChange}
                    required
                  />


                  <span>

                    I agree to receive registration
                    updates and session details.

                  </span>

                </label>


                {/* SUBMIT */}

                <button
                  className="registration-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading
                      ? 'not-allowed'
                      : 'pointer'
                  }}
                >

                  {loading
                    ? 'Submitting...'
                    : 'Reserve my place'
                  }


                  {!loading && (
                    <FaCheckCircle />
                  )}

                </button>


                {/* SECURITY MESSAGE */}

                <p className="registration-secure">

                  <FaLock />

                  Your information is securely
                  submitted to our registration system.

                </p>

              </form>

            </>

          )}

        </section>

      </div>

    </main>

  );

};


export default Registration;