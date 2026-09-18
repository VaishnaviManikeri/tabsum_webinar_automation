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
                        <td>{formatStatus(row.confirmation_whatsapp_status)}</td>
                      </>
                    ) : (
                      <>
                        <td>{row.reminder_type || 'Not created'}</td>
                        <td>{formatDate(row.scheduled_at)}</td>
                        <td>{formatStatus(row.reminder_email_status)}</td>
                        <td>{formatStatus(row.reminder_whatsapp_status)}</td>
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

export default NotificationStatusAdmin;