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
  webinarAPI,
  paymentAPI
} from '../api';

// Local-only payment test mode. Keep this false/undefined in production.
const RAZORPAY_MOCK_MODE =
  import.meta.env.VITE_RAZORPAY_MOCK_MODE === 'true';


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

  // Stores the registration created in database
  const [registrationId, setRegistrationId] =
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
  // OPEN RAZORPAY CHECKOUT
  // ==================================================

  const openRazorpayCheckout = async ({
    registrationId,
    customer
  }) => {

    try {

      // ----------------------------------------------
      // Create Razorpay order
      // ----------------------------------------------

      const response =
        await paymentAPI.createOrder(
          registrationId
        );


      console.log(
        'Create order response:',
        response
      );


      const paymentData =
        response?.data?.data;


      if (
        !paymentData ||
        !paymentData.orderId
      ) {

        throw new Error(
          response?.data?.message ||
          'Unable to create payment order.'
        );

      }


      // ----------------------------------------------
      // LOCAL MOCK PAYMENT E2E
      // ----------------------------------------------
      // The backend mock mode creates a fake Razorpay order.
      // A real Razorpay Checkout window cannot process that fake
      // order, so local E2E testing must call the same verification
      // API directly with the backend's mock payment values.
      // This branch is controlled only by VITE_RAZORPAY_MOCK_MODE
      // and is disabled by default in production.
      // ----------------------------------------------

      if (RAZORPAY_MOCK_MODE) {
        try {
          const mockPaymentId =
            `pay_mock_${Date.now()}`;

          console.log(
            'RAZORPAY MOCK FRONTEND PAYMENT:',
            {
              registrationId,
              paymentId: mockPaymentId,
              orderId: paymentData.orderId
            }
          );

          const verifyResponse =
            await paymentAPI.verifyPayment({
              registrationId,
              razorpay_payment_id:
                mockPaymentId,
              razorpay_order_id:
                paymentData.orderId,
              razorpay_signature:
                'MOCK_SIGNATURE'
            });

          console.log(
            'Mock payment verification response:',
            verifyResponse
          );

          const verificationData =
            verifyResponse?.data?.data;

          if (
            verifyResponse?.data?.success &&
            verificationData?.status === 'paid'
          ) {
            sessionStorage.removeItem(
              'razorpayPaymentResponse'
            );

            setSubmitted(true);
            setLoading(false);

            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });

            return;
          }

          throw new Error(
            verifyResponse?.data?.message ||
            'Mock payment verification failed.'
          );
        } catch (error) {
          console.error(
            'Mock payment verification error:',
            error
          );

          setLoading(false);
          setError(
            error?.response?.data?.message ||
            error?.message ||
            'Mock payment verification failed.'
          );

          return;
        }
      }

      // ----------------------------------------------
      // Check Razorpay Checkout
      // ----------------------------------------------

      if (
        typeof window.Razorpay !==
        'function'
      ) {

        throw new Error(
          'Razorpay Checkout is not loaded. Please refresh the page and try again.'
        );

      }


      // ----------------------------------------------
      // Razorpay Options
      // ----------------------------------------------

      const options = {

        key:
          paymentData.keyId,

        amount:
          paymentData.amount,

        currency:
          paymentData.currency || 'INR',

        name:
          'The Abundance Crossroad™',

        description:
          '2-Day Webinar Experience',

        order_id:
          paymentData.orderId,


        // ------------------------------------------
        // Customer information
        // ------------------------------------------

        prefill: {

          name:
            `${customer.firstName} ${customer.lastName}`,

          email:
            customer.email,

          contact:
            customer.phone

        },


        // ------------------------------------------
        // Notes
        // ------------------------------------------

        notes: {

          registration_id:
            String(registrationId),

          webinar:
            webinar?.title ||
            'The Abundance Crossroad™'

        },


        // ------------------------------------------
        // Theme
        // ------------------------------------------

        theme: {

          color: '#00adb5'

        },


        // ==========================================
        // PAYMENT SUCCESS HANDLER
        // ==========================================

        handler: async (razorpayResponse) => {

          try {

            console.log(
              'Razorpay payment response:',
              razorpayResponse
            );


            setLoading(true);

            setError('');


            // --------------------------------------
            // Validate Razorpay response
            // --------------------------------------

            if (
              !razorpayResponse
                ?.razorpay_payment_id ||
              !razorpayResponse
                ?.razorpay_order_id ||
              !razorpayResponse
                ?.razorpay_signature
            ) {

              throw new Error(
                'Incomplete payment response received from Razorpay.'
              );

            }


            // --------------------------------------
            // Send payment details to backend
            // --------------------------------------

            const verifyResponse =
              await paymentAPI.verifyPayment({

                registrationId:

                  registrationId,

                razorpay_payment_id:

                  razorpayResponse
                    .razorpay_payment_id,

                razorpay_order_id:

                  razorpayResponse
                    .razorpay_order_id,

                razorpay_signature:

                  razorpayResponse
                    .razorpay_signature

              });


            console.log(
              'Payment verification response:',
              verifyResponse
            );


            const verificationData =
              verifyResponse?.data?.data;


            // --------------------------------------
            // Check verification result
            // --------------------------------------

            if (
              verifyResponse?.data?.success &&
              verificationData?.status === 'paid'
            ) {

              // Remove old temporary payment data
              sessionStorage.removeItem(
                'razorpayPaymentResponse'
              );


              // Payment is genuinely verified
              setSubmitted(true);

              setLoading(false);


              // Scroll to success section
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });


              return;

            }


            // --------------------------------------
            // Verification failed
            // --------------------------------------

            throw new Error(
              verifyResponse?.data?.message ||
              'Payment verification failed.'
            );

          } catch (error) {

            console.error(
              'Payment verification error:',
              error
            );


            setLoading(false);


            setError(
              error?.response?.data?.message ||
              error?.message ||
              'Payment was completed, but verification failed. Please contact support.'
            );

          }

        },


        // ==========================================
        // PAYMENT WINDOW CLOSED
        // ==========================================

        modal: {

          ondismiss: () => {

            console.log(
              'Razorpay payment window closed.'
            );


            setLoading(false);


            setError(
              'Payment window was closed. Your registration is saved, but payment is still pending.'
            );

          }

        },


        // ==========================================
        // PAYMENT FAILED
        // ==========================================

        callback_url: undefined

      };


      // ----------------------------------------------
      // Create Razorpay instance
      // ----------------------------------------------

      const razorpay =
        new window.Razorpay(options);


      // ----------------------------------------------
      // Razorpay payment failed event
      // ----------------------------------------------

      razorpay.on(
        'payment.failed',
        (response) => {

          console.error(
            'Razorpay payment failed:',
            response
          );


          setLoading(false);


          setError(
            response?.error?.description ||
            'Payment failed. Please try again.'
          );

        }
      );


      // ----------------------------------------------
      // Open Razorpay
      // ----------------------------------------------

      razorpay.open();

    } catch (error) {

      console.error(
        'Razorpay checkout error:',
        error
      );


      setLoading(false);


      setError(
        error?.response?.data?.message ||
        error?.message ||
        'Unable to open payment gateway. Please try again.'
      );

    }

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
      // Make sure webinar exists
      // ----------------------------------------------

      if (!webinar?.id) {

        throw new Error(
          'Webinar information is not available. Please refresh the page and try again.'
        );

      }


      // ----------------------------------------------
      // Create registration
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

          webinarId:
            webinar.id,

          source:
            'Website'

        });


      console.log(
        'Registration response:',
        response
      );


      // ----------------------------------------------
      // Check registration response
      // ----------------------------------------------

      if (
        !response?.data?.success
      ) {

        throw new Error(
          response?.data?.message ||
          'Registration failed.'
        );

      }


      // ----------------------------------------------
      // Get registration ID
      // ----------------------------------------------

      const createdRegistration =
        response?.data?.data;


      const createdRegistrationId =
        createdRegistration?.id ||
        createdRegistration?.registrationId ||
        createdRegistration?.registration_id ||
        response?.data?.registrationId;


      if (!createdRegistrationId) {

        console.error(
          'Registration response does not contain ID:',
          response
        );


        throw new Error(
          'Registration was created, but registration ID was not received.'
        );

      }


      // ----------------------------------------------
      // Save registration ID
      // ----------------------------------------------

      setRegistrationId(
        createdRegistrationId
      );


      // ----------------------------------------------
      // Open Razorpay
      // ----------------------------------------------

      await openRazorpayCheckout({

        registrationId:
          createdRegistrationId,

        customer: {

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.email,

          phone:
            formData.phone

        }

      });

    } catch (error) {

      console.error(
        'Registration error:',
        error
      );


      setError(
        error?.response?.data?.message ||
        error?.message ||
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
                Registration & Payment Confirmed
              </span>


              <h2>
                Your place is confirmed.
              </h2>


              <p>

                Your registration and payment have
                been successfully verified.

                <br />

                We will use your registered contact
                details for webinar communication,
                session updates and joining instructions.

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
                    background:
                      'rgba(220, 38, 38, 0.12)',
                    border:
                      '1px solid rgba(248, 113, 113, 0.35)',
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


                {/* =================================================
                    SUBMIT / PAYMENT
                ================================================= */}

                <button
                  className="registration-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    opacity:
                      loading ? 0.7 : 1,

                    cursor:
                      loading
                        ? 'not-allowed'
                        : 'pointer'
                  }}
                >

                  {loading
                    ? 'Processing...'
                    : 'Proceed to secure payment — ₹249'
                  }


                  {!loading && (
                    <FaCheckCircle />
                  )}

                </button>


                {/* =================================================
                    SECURITY MESSAGE
                ================================================= */}

                <p className="registration-secure">

                  <FaLock />

                  Your registration is securely
                  submitted and payment is processed
                  through Razorpay.

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