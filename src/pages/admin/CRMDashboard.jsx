import { useEffect, useState } from 'react';
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