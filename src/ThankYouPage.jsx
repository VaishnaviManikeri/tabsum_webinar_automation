import { Link, useLocation } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHome,
  FaLock,
  FaUsers,
  FaVideo,
  FaWhatsapp
} from 'react-icons/fa';

import './ThankYouPage.css';

const communityUrl =
  import.meta.env.VITE_WHATSAPP_COMMUNITY_URL || '';

const isCommunityTestMode =
  import.meta.env.VITE_WHATSAPP_COMMUNITY_TEST_MODE === 'true';

const ThankYouPage = () => {
  const { state } = useLocation();
  const firstName = state?.firstName || 'there';
  const webinarTitle =
    state?.webinarTitle || 'The Abundance Crossroad™';
  const webinarDate = state?.webinarDate || 'the scheduled date';
  const webinarTime = state?.webinarTime || 'the scheduled time';
  const testingMode = state?.testingMode || isCommunityTestMode;

  return (
    <main className="thank-you-page">
      <div className="thank-you-orb thank-you-orb-one" />
      <div className="thank-you-orb thank-you-orb-two" />

      <header className="thank-you-header">
        <Link to="/" className="thank-you-brand">
          <span aria-hidden="true">∞</span>
          Infinite <strong>Blessing</strong>
        </Link>
      </header>

      <section className="thank-you-card" aria-labelledby="thank-you-heading">
        <div className="thank-you-icon" aria-hidden="true">
          <FaCheckCircle />
        </div>

        <span className="thank-you-eyebrow">
          Registration and payment confirmed
        </span>

        <h1 id="thank-you-heading">
          Thank you, {firstName}. Your place is confirmed.
        </h1>

        <p className="thank-you-intro">
          You are registered for <strong>{webinarTitle}</strong> on{' '}
          {webinarDate} at {webinarTime}.
        </p>

        <div className="community-panel">
          <div className="community-panel-icon" aria-hidden="true">
            <FaUsers />
          </div>
          <div>
            <h2>Step 1: Join the WhatsApp Community</h2>
            <p>
              Join for participant updates and helpful session reminders.
            </p>
          </div>

          {communityUrl ? (
            <a
              className="community-link"
              href={communityUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              {testingMode
                ? 'Open test community invite'
                : 'Join WhatsApp Community'}
            </a>
          ) : (
            <p className="community-unavailable" role="status">
              The community invite is being prepared. Please check the
              confirmation messages below.
            </p>
          )}
        </div>

        <div className="delivery-list" aria-label="Your confirmation steps">
          <article>
            <FaEnvelope aria-hidden="true" />
            <div>
              <h2>Step 2: Confirmation email</h2>
              <p>Your registration confirmation is sent to your email address.</p>
            </div>
          </article>

          <article>
            <FaCalendarAlt aria-hidden="true" />
            <div>
              <h2>Step 3: Calendar invite</h2>
              <p>Your confirmation email includes an .ics file to save the event.</p>
            </div>
          </article>

          <article>
            <FaVideo aria-hidden="true" />
            <div>
              <h2>Step 4: Zoom joining details</h2>
              <p>The Zoom link is included in the confirmation email and WhatsApp message.</p>
            </div>
          </article>
        </div>

        {testingMode && (
          <p className="test-mode-notice">
            <FaLock aria-hidden="true" />
            Test mode is active. WhatsApp and Zoom actions use the project’s mock services.
          </p>
        )}

        <Link to="/" className="thank-you-home-link">
          <FaHome aria-hidden="true" />
          Return to homepage
        </Link>
      </section>
    </main>
  );
};

export default ThankYouPage;
