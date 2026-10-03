/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExclamationCircle,
  FaSyncAlt,
  FaWhatsapp
} from 'react-icons/fa';

import { notificationStatusAPI } from '../../api';

import './NotificationStatusAdmin.css';

const statusLabels = {
  sent: 'Sent',
  pending: 'Pending',
  failed: 'Failed',
  skipped: 'Skipped',
  not_created: 'Not created'
};

const formatStatus = (status) => {
  const value = status || 'not_created';
  const Icon = value === 'sent'
    ? FaCheckCircle
    : value === 'failed'
      ? FaExclamationCircle
      : FaClock;

  return (
    <span className={`notification-status ${value}`}>
      <Icon />
      {statusLabels[value] || value}
    </span>
  );
};

const formatPaymentStatus = (status) => {
  const value = status || 'pending';
  const Icon = value === 'paid'
    ? FaCheckCircle
    : value === 'failed'
      ? FaExclamationCircle
      : FaClock;

  return (
    <span className={`notification-status ${value}`}>
      <Icon />
      {value === 'paid'
        ? 'Paid'
        : value === 'failed'
          ? 'Failed'
          : 'Pending'}
    </span>
  );
};

const formatDate = (value) => {
  if (!value) return 'Not scheduled';

  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const reminderMessages = {
  reminder_24h: {
    template: 'reminder_24h',
    copy: 'Your webinar is happening tomorrow. We are excited to have you with us!'
  },
  reminder_3h: {
    template: 'reminder_3h',
    copy: 'Your webinar starts in 3 hours. Please keep your Zoom details ready.'
  },
  reminder_30m: {
    template: 'reminder_30m',
    copy: 'Your webinar starts in 30 minutes. Please join on time.'
  }
};

const getWhatsAppMessage = (row, isConfirmation) => {
  if (isConfirmation) {
    return {
      template: 'registration_confirmation',
      copy: 'Personalized confirmation with participant, webinar, schedule and Zoom details.'
    };
  }

  return reminderMessages[row.reminder_type] || {
    template: 'upcoming_webinar_reminder',
    copy: 'Personalized upcoming webinar reminder.'
  };
};

const NotificationStatusAdmin = (props) => {
  const { mode } = props;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchStatuses = async () => {
    try {
      setError('');
      const response = await notificationStatusAPI.getAll();
      setRows(response.data?.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to load notification statuses.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    return rows.filter((row) => {
      if (!value) return true;

      return [
        row.first_name,
        row.last_name,
        row.email,
        row.phone,
        row.webinar_title_snapshot,
        row.reminder_type
      ].some((field) =>
        String(field || '').toLowerCase().includes(value)
      );
    });
  }, [rows, search]);

  const isConfirmation = mode === 'confirmation';

  const displayRows = isConfirmation
    ? Array.from(
        new Map(
          filteredRows.map((row) => [row.registration_id, row])
        ).values()
      )
    : filteredRows;

  return (
    <section className="notification-status-page">
      <div className="notification-status-header">
        <div>
          <span className="notification-status-eyebrow">
            Delivery monitoring
          </span>
          <h1>
            {isConfirmation ? 'Confirmation Status' : 'Reminder Status'}
          </h1>
          <p>
            {isConfirmation
              ? 'Track confirmation email and WhatsApp delivery for paid registrations.'
              : 'Track each scheduled reminder across email and WhatsApp.'}
          </p>
        </div>

        <button
          type="button"
          className="notification-refresh-button"
          onClick={() => {
            setRefreshing(true);
            fetchStatuses();
          }}
          disabled={refreshing}
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      <div className="notification-status-toolbar">
        <label htmlFor="notification-status-search">
          Search registrations
        </label>
        <input
          id="notification-status-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, email, phone or reminder type"
        />
      </div>

      <div className="whatsapp-message-guide">
        <div className="whatsapp-guide-heading">
          <FaWhatsapp />
          <div>
            <span>WhatsApp delivery map</span>
            <strong>Messages sent to registered users</strong>
          </div>
        </div>
        <div className="whatsapp-guide-items">
          {isConfirmation ? (
            <div className="whatsapp-guide-item">
              <span>Confirmation</span>
              <strong>registration_confirmation</strong>
              <p>Registration, webinar schedule and Zoom details.</p>
            </div>
          ) : Object.entries(reminderMessages).map(([key, message]) => (
            <div className="whatsapp-guide-item" key={key}>
              <span>{key.replace('reminder_', '').replace('h', ' hours').replace('m', ' minutes')}</span>
              <strong>{message.template}</strong>
              <p>{message.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="notification-status-error">{error}</div>}

      {loading ? (
        <div className="notification-status-empty">Loading statuses...</div>
      ) : displayRows.length === 0 ? (
        <div className="notification-status-empty">
          No notification status records found.
        </div>
      ) : (
        <div className="notification-status-table-wrap">
          <table className="notification-status-table">
            <thead>
              <tr>
                <th>Registrant</th>
                <th>Payment</th>
                {isConfirmation ? (
                  <>
                    <th><FaEnvelope /> Confirmation email</th>
                    <th><FaWhatsapp /> Confirmation WhatsApp</th>
                  </>
                ) : (
                  <>
                    <th>Reminder</th>
                    <th>Scheduled</th>
                    <th><FaEnvelope /> Email</th>
                    <th><FaWhatsapp /> WhatsApp</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                  <tr key={`${row.registration_id}-${row.reminder_id || 'confirmation'}`}>
                    <td>
                      <strong>{row.first_name} {row.last_name}</strong>
                      <span>{row.email}</span>
                      <span>{row.phone}</span>
                    </td>
                    <td>{formatPaymentStatus(row.payment_status)}</td>
                    {isConfirmation ? (
                      <>
                        <td>{formatStatus(row.confirmation_email_status)}</td>
                        <td>
                          {formatStatus(row.confirmation_whatsapp_status)}
                          <WhatsAppMessagePreview row={row} isConfirmation />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.reminder_type || 'Not created'}</td>
                        <td>{formatDate(row.scheduled_at)}</td>
                        <td>{formatStatus(row.reminder_email_status)}</td>
                        <td>
                          {formatStatus(row.reminder_whatsapp_status)}
                          <WhatsAppMessagePreview row={row} />
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const WhatsAppMessagePreview = ({ row, isConfirmation = false }) => {
  const message = getWhatsAppMessage(row, isConfirmation);

  return (
    <span className="whatsapp-message-preview">
      <strong>{message.template}</strong>
      <small>{message.copy}</small>
    </span>
  );
};

export default NotificationStatusAdmin;