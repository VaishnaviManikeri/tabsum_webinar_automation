import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaUserPlus,
  FaCheckCircle,
  FaHeart,
  FaSearch,
  FaSync,
  FaChartLine
} from 'react-icons/fa';

import { leadAPI } from '../../api';
import './CRMDashboard.css';


const CRMDashboard = () => {

  const [leads, setLeads] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    new_leads: 0,
    registered: 0,
    interested: 0,
    converted: 0,
    lost: 0
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const loadCRM = async () => {

    try {

      setLoading(true);
      setError('');

      const [leadsResponse, statsResponse] =
        await Promise.all([
          leadAPI.getAll({
            search,
            status
          }),
          leadAPI.getStats()
        ]);

      setLeads(
        leadsResponse.data.leads || []
      );

      setStats(
        statsResponse.data.stats || {}
      );

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        'Unable to load CRM data'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    const timer = setTimeout(() => {
      loadCRM();
    }, 300);

    return () => clearTimeout(timer);

  }, [search, status]);


  const handleStatusChange = async (
    id,
    newStatus
  ) => {

    try {

      await leadAPI.updateStatus(
        id,
        newStatus
      );

      loadCRM();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        'Unable to update lead status'
      );

    }
  };


  const formatDate = (date) => {

    if (!date) return '-';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  const statusBreakdown = [
    { key: 'new_leads', label: 'New', color: '#f59e0b' },
    { key: 'registered', label: 'Registered', color: '#3b82f6' },
    { key: 'interested', label: 'Interested', color: '#ec4899' },
    { key: 'converted', label: 'Converted', color: '#10b981' },
    { key: 'lost', label: 'Lost', color: '#ef4444' }
  ].map(item => ({
    ...item,
    value: Number(stats[item.key]) || 0
  }));

  const totalLeads = Number(stats.total) || 0;
  const statusTotal = statusBreakdown.reduce((sum, item) => sum + item.value, 0);
  const chartTotal = statusTotal || totalLeads;
  const largestStatus = Math.max(...statusBreakdown.map(item => item.value), 1);
  let chartStart = 0;
  const chartStops = chartTotal
    ? statusBreakdown.map(item => {
      const chartEnd = chartStart + (item.value / chartTotal) * 100;
      const stop = `${item.color} ${chartStart}% ${chartEnd}%`;
      chartStart = chartEnd;
      return stop;
    }).join(', ')
    : '#e2e8f0 0% 100%';
  const conversionRate = totalLeads
    ? Math.round(((Number(stats.converted) || 0) / totalLeads) * 100)
    : 0;


  return (

    <div className="crm-page">

      {/* Header */}

      <div className="crm-header">

        <div>
          <span className="crm-eyebrow">
            Webinar Management
          </span>

          <h1>CRM Dashboard</h1>

          <p>
            Manage webinar leads, registrations
            and customer journey.
          </p>
        </div>

        <div className="crm-header-actions">
          <Link
            className="crm-attendance-link"
            to="/admin/dashboard/attendance"
          >
            <FaUsers />
            Attendance & recordings
          </Link>

          <button
            className="crm-refresh"
            onClick={loadCRM}
            disabled={loading}
          >
            <FaSync
              className={loading ? 'crm-spin' : ''}
            />

            Refresh
          </button>
        </div>

      </div>


      {/* Stats */}

      <div className="crm-stats">

        <div className="crm-stat-card">

          <div className="crm-stat-icon">
            <FaUsers />
          </div>

          <div>
            <span>Total Leads</span>
            <strong>{stats.total || 0}</strong>
          </div>

        </div>


        <div className="crm-stat-card">

          <div className="crm-stat-icon">
            <FaUserPlus />
          </div>

          <div>
            <span>New Leads</span>
            <strong>{stats.new_leads || 0}</strong>
          </div>

        </div>


        <div className="crm-stat-card">

          <div className="crm-stat-icon">
            <FaHeart />
          </div>

          <div>
            <span>Interested</span>
            <strong>{stats.interested || 0}</strong>
          </div>

        </div>


        <div className="crm-stat-card">

          <div className="crm-stat-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>Converted</span>
            <strong>{stats.converted || 0}</strong>
          </div>

        </div>

      </div>

      <div className="crm-analytics">

        <section className="crm-chart-card crm-distribution-card">
          <div className="crm-chart-heading">
            <div>
              <span className="crm-chart-kicker">Pipeline health</span>
              <h2>Lead distribution</h2>
            </div>
            <span className="crm-chart-period">All time</span>
          </div>

          <div className="crm-donut-layout">
            <div
              className="crm-donut"
              style={{ background: `conic-gradient(${chartStops})` }}
              aria-label={`${totalLeads} total leads across five statuses`}
            >
              <div className="crm-donut-center">
                <strong>{totalLeads}</strong>
                <span>Total leads</span>
              </div>
            </div>

            <div className="crm-legend">
              {statusBreakdown.map(item => (
                <div className="crm-legend-item" key={item.key}>
                  <span className="crm-legend-label">
                    <i style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="crm-chart-card crm-funnel-card">
          <div className="crm-chart-heading">
            <div>
              <span className="crm-chart-kicker">Conversion funnel</span>
              <h2>Lead momentum</h2>
            </div>
            <div className="crm-conversion-rate">
              <strong>{conversionRate}%</strong>
              <span>conversion</span>
            </div>
          </div>

          <div className="crm-bar-chart">
            {statusBreakdown.map(item => (
              <div className="crm-bar-row" key={item.key}>
                <span className="crm-bar-label">{item.label}</span>
                <div className="crm-bar-track">
                  <span
                    className="crm-bar-fill"
                    style={{ width: `${(item.value / largestStatus) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

      </div>


      {/* Lead Management */}

      <div className="crm-card">

        <div className="crm-card-header">

          <div>

            <h2>
              Leads
            </h2>

            <p>
              View and manage your webinar leads.
            </p>

          </div>

          <div className="crm-lead-count">
            {leads.length} Leads
          </div>

        </div>


        {/* Filters */}

        <div className="crm-filters">

          <div className="crm-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="all">
              All Status
            </option>

            <option value="new">
              New
            </option>

            <option value="registered">
              Registered
            </option>

            <option value="interested">
              Interested
            </option>

            <option value="converted">
              Converted
            </option>

            <option value="lost">
              Lost
            </option>

          </select>

        </div>


        {error && (

          <div className="crm-error">
            {error}
          </div>

        )}


        {/* Table */}

        <div className="crm-table-wrapper">

          <table className="crm-table">

            <thead>

              <tr>

                <th>Lead</th>

                <th>Contact</th>

                <th>Role</th>

                <th>City</th>

                <th>Source</th>

                <th>Status</th>

                <th>Date</th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="crm-empty"
                  >
                    Loading leads...
                  </td>

                </tr>

              ) : leads.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="crm-empty"
                  >
                    <FaChartLine />

                    <span>
                      No leads found
                    </span>
                  </td>

                </tr>

              ) : (

                leads.map((lead) => (

                  <tr key={lead.id}>

                    <td>

                      <div className="crm-lead-name">

                        <div className="crm-avatar">
                          {lead.first_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {lead.first_name}{' '}
                            {lead.last_name}
                          </strong>

                          <span>
                            #{lead.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      <div className="crm-contact">

                        <strong>
                          {lead.email}
                        </strong>

                        <span>
                          {lead.phone}
                        </span>

                      </div>

                    </td>


                    <td>
                      {lead.role || '-'}
                    </td>


                    <td>
                      {lead.city || '-'}
                    </td>


                    <td>
                      {lead.source || 'Website'}
                    </td>


                    <td>

                      <select
                        className={`crm-status crm-status-${lead.lead_status}`}
                        value={lead.lead_status}
                        onChange={(e) =>
                          handleStatusChange(
                            lead.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="new">
                          New
                        </option>

                        <option value="registered">
                          Registered
                        </option>

                        <option value="interested">
                          Interested
                        </option>

                        <option value="converted">
                          Converted
                        </option>

                        <option value="lost">
                          Lost
                        </option>

                      </select>

                    </td>


                    <td>
                      {formatDate(
                        lead.created_at
                      )}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default CRMDashboard;
