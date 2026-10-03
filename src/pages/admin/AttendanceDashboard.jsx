/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaLink,
  FaPlayCircle,
  FaSyncAlt,
  FaUpload,
  FaUserCheck,
  FaUserTimes,
  FaUsers,
  FaWhatsapp
} from 'react-icons/fa';

import { attendanceAPI } from '../../api';
import './AttendanceDashboard.css';

const statusLabel = (status) =>
  String(status || 'not_created')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDateTime = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const AttendanceGroup = ({
  title,
  description,
  icon: Icon,
  tone,
  registrations,
  onChangeStatus
}) => (
  <section className={`attendance-group attendance-group-${tone}`}>
    <div className="attendance-group-heading">
      <div>
        <span className="attendance-group-kicker">
          <Icon aria-hidden="true" /> {registrations.length} paid registrant{registrations.length === 1 ? '' : 's'}
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>

    <div className="attendance-table-wrap">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Registrant</th>
            <th>Automation</th>
            <th>Attendance</th>
            <th>Recording</th>
            <th>Correct status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.length === 0 ? (
            <tr>
              <td colSpan="5" className="attendance-empty">No registrants in this group.</td>
            </tr>
          ) : registrations.map((registration) => (
            <tr key={registration.registration_id}>
              <td>
                <strong>{registration.first_name} {registration.last_name}</strong>
                <span>{registration.email}</span>
              </td>
              <td>
                <span className={`automation-status automation-${registration.confirmation_email_status}`}>
                  <FaEnvelope aria-hidden="true" /> {statusLabel(registration.confirmation_email_status)}
                </span>
                <span className={`automation-status automation-${registration.confirmation_whatsapp_status}`}>
                  <FaWhatsapp aria-hidden="true" /> {statusLabel(registration.confirmation_whatsapp_status)}
                </span>
              </td>
              <td>
                <span className={`attendance-badge attendance-badge-${registration.attendance_status}`}>
                  {statusLabel(registration.attendance_status)}
                </span>
                {registration.attendance_status === 'attended' && (
                  <small>
                    {registration.duration_minutes
                      ? `${registration.duration_minutes} min`
                      : 'Duration not available'}
                    {registration.joined_at ? ` · Joined ${formatDateTime(registration.joined_at)}` : ''}
                  </small>
                )}
                {registration.attendance_source && (
                  <small>Source: {statusLabel(registration.attendance_source)}</small>
                )}
              </td>
              <td>
                {registration.attendance_status === 'absent' ? (
                  <>
                    <span className={`recording-status recording-${registration.recording_email_status}`}>
                      {statusLabel(registration.recording_email_status)}
                    </span>
                    {registration.recording_email_sent_at && (
                      <small>Sent {formatDateTime(registration.recording_email_sent_at)}</small>
                    )}
                    {registration.recording_email_error && (
                      <small className="recording-error">{registration.recording_email_error}</small>
                    )}
                  </>
                ) : '—'}
              </td>
              <td>
                <select
                  aria-label={`Set attendance for ${registration.first_name} ${registration.last_name}`}
                  value={registration.attendance_status === 'pending' ? '' : registration.attendance_status}
                  onChange={(event) => onChangeStatus(
                    registration.registration_id,
                    event.target.value
                  )}
                >
                  <option value="">Choose…</option>
                  <option value="attended">Attended</option>
                  <option value="absent">Did not attend</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const AttendanceDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [recordingSource, setRecordingSource] = useState('link');
  const [recordingLink, setRecordingLink] = useState('');
  const [recordingFile, setRecordingFile] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError('');

      const response = await attendanceAPI.getDashboard();

      setDashboard(response.data?.data || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to load webinar attendance.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const applyDashboard = (data) => {
    if (data?.dashboard) {
      setDashboard(data.dashboard);
    } else if (data?.webinar && data?.registrations) {
      setDashboard(data);
    } else {
      loadDashboard();
    }
  };

  const handleSync = async (live) => {
    if (!dashboard?.webinar?.id) return;

    try {
      setWorking(live ? 'live' : 'completed');
      setError('');
      setMessage('');

      const response = await attendanceAPI.sync(
        dashboard.webinar.id,
        { live }
      );

      applyDashboard(response.data?.data);
      setMessage(response.data?.message || 'Attendance refreshed.');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to refresh attendance.'
      );
    } finally {
      setWorking('');
    }
  };

  const handleStatusChange = async (
    registrationId,
    attendanceStatus
  ) => {
    if (!attendanceStatus) return;

    try {
      setWorking(`registration-${registrationId}`);
      setError('');
      setMessage('');

      const response = await attendanceAPI.updateStatus(
        registrationId,
        attendanceStatus
      );

      applyDashboard(response.data?.data);
      setMessage(response.data?.message || 'Attendance updated.');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to update attendance.'
      );
    } finally {
      setWorking('');
    }
  };

  const handleSendRecordings = async (event) => {
    event.preventDefault();

    if (!dashboard?.webinar?.id) return;

    try {
      setWorking('recordings');
      setError('');
      setMessage('');

      const formData = new FormData();

      if (recordingSource === 'upload') {
        if (!recordingFile) {
          setError('Choose a video file to upload.');
          setWorking('');
          return;
        }

        formData.append('recording', recordingFile);
      } else {
        formData.append('recordingUrl', recordingLink.trim());
      }

      const response = await attendanceAPI.sendRecordings(
        dashboard.webinar.id,
        formData
      );

      applyDashboard(response.data?.data);
      setMessage(response.data?.message || 'Recording delivery completed.');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to send recordings.'
      );
    } finally {
      setWorking('');
    }
  };

  const groups = useMemo(() => {
    const registrations = dashboard?.registrations || [];

    return {
      attended: registrations.filter((item) => item.attendance_status === 'attended'),
      absent: registrations.filter((item) => item.attendance_status === 'absent'),
      pending: registrations.filter((item) => item.attendance_status === 'pending')
    };
  }, [dashboard]);

  if (loading) {
    return <div className="attendance-loading">Loading webinar attendance…</div>;
  }

  if (!dashboard) {
    return (
      <div className="attendance-page">
        <div className="attendance-error">{error || 'No webinar is available.'}</div>
      </div>
    );
  }

  const { webinar, summary } = dashboard;
  const attendanceRate = summary.paid
    ? Math.round((summary.attended / summary.paid) * 100)
    : 0;

  return (
    <div className="attendance-page">
      <header className="attendance-header">
        <div>
          <span className="attendance-eyebrow">Webinar operations</span>
          <h1>Attendance & recordings</h1>
          <p>{webinar.title} · {webinar.date || 'Date to be confirmed'} {webinar.time ? `· ${webinar.time}` : ''}</p>
        </div>
        <div className="attendance-actions">
          <Link
            className="attendance-button attendance-button-secondary"
            to="/admin/dashboard/crm"
          >
            Back to CRM
          </Link>
          <button type="button" className="attendance-button attendance-button-secondary" onClick={loadDashboard} disabled={Boolean(working)}>
            <FaSyncAlt aria-hidden="true" /> Refresh
          </button>
          <button type="button" className="attendance-button attendance-button-secondary" onClick={() => handleSync(true)} disabled={Boolean(working)}>
            <FaUserCheck aria-hidden="true" /> {working === 'live' ? 'Refreshing…' : 'Refresh live attendance'}
          </button>
          <button type="button" className="attendance-button attendance-button-primary" onClick={() => handleSync(false)} disabled={Boolean(working)}>
            <FaCheckCircle aria-hidden="true" /> {working === 'completed' ? 'Syncing…' : 'Sync completed attendance'}
          </button>
        </div>
      </header>

      {error && <div className="attendance-error"><FaExclamationTriangle aria-hidden="true" /> {error}</div>}
      {message && <div className="attendance-message"><FaCheckCircle aria-hidden="true" /> {message}</div>}

      <section className="attendance-stats">
        <article className="attendance-stat-card"><span><FaUsers aria-hidden="true" /> Registered</span><strong>{summary.registered}</strong></article>
        <article className="attendance-stat-card"><span><FaCheckCircle aria-hidden="true" /> Paid</span><strong>{summary.paid}</strong></article>
        <article className="attendance-stat-card attendance-stat-attended"><span><FaUserCheck aria-hidden="true" /> Attended</span><strong>{summary.attended}</strong><small>{attendanceRate}% of paid</small></article>
        <article className="attendance-stat-card attendance-stat-absent"><span><FaUserTimes aria-hidden="true" /> Did not attend</span><strong>{summary.absent}</strong><small>{summary.recordingSent} recording{summary.recordingSent === 1 ? '' : 's'} sent</small></article>
      </section>

      <section className="attendance-journeys">
        <article className="attendance-journey-card attendance-journey-attended">
          <div className="attendance-journey-heading"><FaUserCheck aria-hidden="true" /><div><span>Attendance chart</span><h2>Registered → paid → attended</h2></div></div>
          <div className="attendance-flow"><strong>{summary.registered}</strong><i /><strong>{summary.paid}</strong><i /><strong>{summary.attended}</strong></div>
          <div className="attendance-flow-labels"><span>Registered</span><span>Paid</span><span>Attended</span></div>
        </article>
        <article className="attendance-journey-card attendance-journey-absent">
          <div className="attendance-journey-heading"><FaUserTimes aria-hidden="true" /><div><span>Recording chart</span><h2>Registered → paid → did not attend</h2></div></div>
          <div className="attendance-flow"><strong>{summary.registered}</strong><i /><strong>{summary.paid}</strong><i /><strong>{summary.absent}</strong></div>
          <div className="attendance-flow-labels"><span>Registered</span><span>Paid</span><span>Did not attend</span></div>
        </article>
      </section>

      <section className="attendance-recording-card">
        <div>
          <span className="attendance-eyebrow">Absentee follow-up</span>
          <h2>Send the webinar recording</h2>
          <p>Only paid registrants marked as <strong>Did not attend</strong> receive it. Successful sends are stored so they are not sent again.</p>
        </div>
        <form className="attendance-recording-form" onSubmit={handleSendRecordings}>
          <fieldset className="recording-source-toggle" disabled={Boolean(working)}>
            <legend>Recording source</legend>
            <label className={recordingSource === 'link' ? 'selected' : ''}>
              <input
                type="radio"
                name="recordingSource"
                value="link"
                checked={recordingSource === 'link'}
                onChange={() => setRecordingSource('link')}
              />
              <FaLink aria-hidden="true" /> Link
            </label>
            <label className={recordingSource === 'upload' ? 'selected' : ''}>
              <input
                type="radio"
                name="recordingSource"
                value="upload"
                checked={recordingSource === 'upload'}
                onChange={() => setRecordingSource('upload')}
              />
              <FaUpload aria-hidden="true" /> Upload video
            </label>
          </fieldset>
          {recordingSource === 'link' ? (
            <label className="recording-input-label">
              Recording URL
              <input
                type="url"
                value={recordingLink}
                onChange={(event) => setRecordingLink(event.target.value)}
                placeholder="https://…"
                required
                disabled={Boolean(working)}
              />
            </label>
          ) : (
            <label className="recording-input-label">
              Video file
              <input
                type="file"
                accept=".avi,.m4v,.mov,.mp4,.mpeg,.webm,video/*"
                onChange={(event) => setRecordingFile(event.target.files?.[0] || null)}
                required
                disabled={Boolean(working)}
              />
              <small>Video files up to 500 MB</small>
            </label>
          )}
          <button type="submit" className="attendance-button attendance-button-recording" disabled={Boolean(working) || summary.absent === 0}>
            <FaPlayCircle aria-hidden="true" /> {working === 'recordings' ? 'Sending…' : `Send to ${summary.absent} absentee${summary.absent === 1 ? '' : 's'}`}
          </button>
        </form>
      </section>

      {summary.pending > 0 && (
        <AttendanceGroup
          title="Needs attendance review"
          description="Zoom has not safely classified these paid registrants yet. Confirm their status before recording delivery."
          icon={FaClock}
          tone="pending"
          registrations={groups.pending}
          onChangeStatus={handleStatusChange}
        />
      )}

      <AttendanceGroup
        title="Registered, paid and attended"
        description="These paid registrants joined the webinar and will not receive the absence recording email."
        icon={FaUserCheck}
        tone="attended"
        registrations={groups.attended}
        onChangeStatus={handleStatusChange}
      />

      <AttendanceGroup
        title="Registered, paid but did not attend"
        description="These paid registrants are eligible for the recording after Zoom or an administrator confirms their absence."
        icon={FaUserTimes}
        tone="absent"
        registrations={groups.absent}
        onChangeStatus={handleStatusChange}
      />
    </div>
  );
};

export default AttendanceDashboard;
