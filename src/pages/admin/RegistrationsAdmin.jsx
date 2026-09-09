import { useEffect, useMemo, useState } from 'react';

import {
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaCreditCard,
  FaDownload,
  FaFilter,
  FaSave
} from 'react-icons/fa';

import {
  registrationAPI
} from '../../api';

import './RegistrationsAdmin.css';


const RegistrationsAdmin = () => {

  // ==================================================
  // STATE
  // ==================================================

  const [
    registrations,
    setRegistrations
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    refreshing,
    setRefreshing
  ] = useState(false);


  const [
    error,
    setError
  ] = useState('');


  const [
    searchTerm,
    setSearchTerm
  ] = useState('');


  const [
    paymentFilter,
    setPaymentFilter
  ] = useState('all');


  const [
    statusFilter,
    setStatusFilter
  ] = useState('all');


  const [
    selectedRegistration,
    setSelectedRegistration
  ] = useState(null);


  const [
    savingPayment,
    setSavingPayment
  ] = useState(false);


  const [
    savingStatus,
    setSavingStatus
  ] = useState(false);


  // ==================================================
  // FETCH REGISTRATIONS
  // ==================================================

  const fetchRegistrations =
    async () => {

      try {

        setError('');

        const response =
          await registrationAPI.getAll();


        if (
          response.data?.success
        ) {

          setRegistrations(
            response.data.data || []
          );

        } else {

          setRegistrations([]);

        }

      } catch (err) {

        console.error(
          'Fetch registrations error:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Unable to load registrations.'
        );

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    fetchRegistrations();

  }, []);


  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh =
    () => {

      setRefreshing(true);

      fetchRegistrations();

    };


  // ==================================================
  // FILTER REGISTRATIONS
  // ==================================================

  const filteredRegistrations =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();


      return registrations.filter(
        (registration) => {

          const fullName =
            `${registration.first_name || ''} ${registration.last_name || ''}`
              .toLowerCase();


          const email =
            registration.email
              ?.toLowerCase() || '';


          const phone =
            registration.phone
              ?.toLowerCase() || '';


          const city =
            registration.city
              ?.toLowerCase() || '';


          const role =
            registration.role
              ?.toLowerCase() || '';


          const matchesSearch =
            !search ||
            fullName.includes(search) ||
            email.includes(search) ||
            phone.includes(search) ||
            city.includes(search) ||
            role.includes(search);


          const matchesPayment =
            paymentFilter === 'all' ||
            (
              registration.payment_status ||
              'pending'
            ) === paymentFilter;


          const matchesStatus =
            statusFilter === 'all' ||
            (
              registration.registration_status ||
              'registered'
            ) === statusFilter;


          return (
            matchesSearch &&
            matchesPayment &&
            matchesStatus
          );

        }
      );

    }, [
      registrations,
      searchTerm,
      paymentFilter,
      statusFilter
    ]);


  // ==================================================
  // DATE FORMAT
  // ==================================================

  const formatDate =
    (date) => {

      if (!date) {
        return '-';
      }


      try {

        return new Date(
          date
        ).toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }
        );

      } catch {

        return date;

      }

    };


  // ==================================================
  // DATETIME FORMAT
  // ==================================================

  const formatDateTime =
    (date) => {

      if (!date) {
        return '-';
      }


      try {

        return new Date(
          date
        ).toLocaleString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }
        );

      } catch {

        return date;

      }

    };


  // ==================================================
  // PAYMENT STATUS UI
  // ==================================================

  const getPaymentStatus =
    (status) => {

      const value =
        status || 'pending';


      if (value === 'paid') {

        return (
          <span className="registration-status paid">
            <FaCheckCircle />
            Paid
          </span>
        );

      }


      if (value === 'failed') {

        return (
          <span className="registration-status failed">
            <FaExclamationCircle />
            Failed
          </span>
        );

      }


      return (
        <span className="registration-status pending">
          <FaClock />
          Pending
        </span>
      );

    };


  // ==================================================
  // REGISTRATION STATUS UI
  // ==================================================

  const getRegistrationStatus =
    (status) => {

      const value =
        status || 'registered';


      if (value === 'cancelled') {

        return (
          <span className="registration-status cancelled">
            <FaTimes />
            Cancelled
          </span>
        );

      }


      return (
        <span className="registration-status registered">
          <FaCheckCircle />
          Registered
        </span>
      );

    };


  // ==================================================
  // VIEW DETAILS
  // ==================================================

  const handleViewDetails =
    (registration) => {

      setSelectedRegistration({
        ...registration
      });

    };


  // ==================================================
  // CLOSE DETAILS
  // ==================================================

  const handleCloseDetails =
    () => {

      setSelectedRegistration(
        null
      );

    };


  // ==================================================
  // UPDATE PAYMENT
  // ==================================================

  const handlePaymentChange =
    (value) => {

      setSelectedRegistration(
        previous => ({
          ...previous,
          payment_status: value
        })
      );

    };


  // ==================================================
  // SAVE PAYMENT
  // ==================================================

  const savePaymentStatus =
    async () => {

      if (!selectedRegistration) {
        return;
      }


      try {

        setSavingPayment(true);


        const response =
          await registrationAPI
            .updatePaymentStatus(
              selectedRegistration.id,
              selectedRegistration.payment_status
            );


        if (
          response.data?.success
        ) {

          const updated =
            response.data.data;


          setRegistrations(
            previous =>
              previous.map(
                item =>
                  item.id === updated.id
                    ? updated
                    : item
              )
          );


          setSelectedRegistration(
            updated
          );

        }


      } catch (err) {

        alert(
          err.response?.data?.message ||
          'Unable to update payment status.'
        );

      } finally {

        setSavingPayment(false);

      }

    };


  // ==================================================
  // UPDATE REGISTRATION STATUS
  // ==================================================

  const handleStatusChange =
    (value) => {

      setSelectedRegistration(
        previous => ({
          ...previous,
          registration_status: value
        })
      );

    };


  // ==================================================
  // SAVE REGISTRATION STATUS
  // ==================================================

  const saveRegistrationStatus =
    async () => {

      if (!selectedRegistration) {
        return;
      }


      try {

        setSavingStatus(true);


        const response =
          await registrationAPI
            .updateRegistrationStatus(
              selectedRegistration.id,
              selectedRegistration.registration_status
            );


        if (
          response.data?.success
        ) {

          const updated =
            response.data.data;


          setRegistrations(
            previous =>
              previous.map(
                item =>
                  item.id === updated.id
                    ? updated
                    : item
              )
          );


          setSelectedRegistration(
            updated
          );

        }


      } catch (err) {

        alert(
          err.response?.data?.message ||
          'Unable to update registration status.'
        );

      } finally {

        setSavingStatus(false);

      }

    };


  // ==================================================
  // EXPORT CSV
  // ==================================================

  const exportCSV =
    () => {

      if (
        filteredRegistrations.length === 0
      ) {

        alert(
          'There are no registrations to export.'
        );

        return;

      }


      const headers = [

        'Registration ID',

        'First Name',

        'Last Name',

        'Email',

        'Phone',

        'City',

        'Role',

        'Goal',

        'Webinar',

        'Registration Status',

        'Payment Status',

        'Registered At'

      ];


      const rows =
        filteredRegistrations.map(
          registration => [

            registration.id,

            registration.first_name,

            registration.last_name,

            registration.email,

            registration.phone,

            registration.city || '',

            registration.role || '',

            registration.goal || '',

            registration.webinar_title || '',

            registration.registration_status || '',

            registration.payment_status || 'pending',

            registration.registered_at || ''

          ]
        );


      const csvContent = [

        headers,

        ...rows

      ]
        .map(
          row =>
            row
              .map(
                value =>
                  `"${String(value ?? '')
                    .replace(/"/g, '""')}"`
              )
              .join(',')
        )
        .join('\n');


      const blob =
        new Blob(
          [csvContent],
          {
            type:
              'text/csv;charset=utf-8;'
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          'a'
        );


      link.href = url;

      link.download =
        `webinar-registrations-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;


      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );


      URL.revokeObjectURL(
        url
      );

    };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="registrations-admin">

        <div className="registrations-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading registrations...
          </p>

        </div>

      </div>
    );

  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (

    <div className="registrations-admin">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="registrations-header">

        <div>

          <span className="registrations-eyebrow">
            Webinar Management
          </span>

          <h1>
            Registrations
          </h1>

          <p>
            Manage and track webinar participants.
          </p>

        </div>


        <div className="registrations-header-actions">

          <button
            className="registrations-export"
            onClick={exportCSV}
          >

            <FaDownload />

            Export CSV

          </button>


          <button
            className="registrations-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >

            <FaSyncAlt
              className={
                refreshing
                  ? 'refresh-spinning'
                  : ''
              }
            />

            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}

          </button>

        </div>

      </div>


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="registration-stat-grid">


        <div className="registration-stat-card">

          <div className="registration-stat-icon">
            <FaUsers />
          </div>

          <div>

            <span>
              Total Registrations
            </span>

            <strong>
              {registrations.length}
            </strong>

          </div>

        </div>


        <div className="registration-stat-card">

          <div className="registration-stat-icon">
            <FaCheckCircle />
          </div>

          <div>

            <span>
              Registered
            </span>

            <strong>

              {
                registrations.filter(
                  item =>
                    item.registration_status ===
                    'registered'
                ).length
              }

            </strong>

          </div>

        </div>


        <div className="registration-stat-card">

          <div className="registration-stat-icon">
            <FaCreditCard />
          </div>

          <div>

            <span>
              Paid
            </span>

            <strong>

              {
                registrations.filter(
                  item =>
                    item.payment_status ===
                    'paid'
                ).length
              }

            </strong>

          </div>

        </div>


        <div className="registration-stat-card">

          <div className="registration-stat-icon">
            <FaClock />
          </div>

          <div>

            <span>
              Payment Pending
            </span>

            <strong>

              {
                registrations.filter(
                  item =>
                    !item.payment_status ||
                    item.payment_status ===
                    'pending'
                ).length
              }

            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="registrations-error">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="registrations-filters">


        <div className="registration-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search name, email, phone, city or role..."
            value={searchTerm}
            onChange={
              e =>
                setSearchTerm(
                  e.target.value
                )
            }
          />

        </div>


        <div className="filter-group">

          <FaFilter />

          <select
            value={paymentFilter}
            onChange={
              e =>
                setPaymentFilter(
                  e.target.value
                )
            }
          >

            <option value="all">
              All Payments
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="failed">
              Failed
            </option>

          </select>

        </div>


        <div className="filter-group">

          <select
            value={statusFilter}
            onChange={
              e =>
                setStatusFilter(
                  e.target.value
                )
            }
          >

            <option value="all">
              All Registrations
            </option>

            <option value="registered">
              Registered
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

        </div>


        <div className="registration-count">

          Showing{' '}

          <strong>
            {filteredRegistrations.length}
          </strong>

          {' '}of{' '}

          <strong>
            {registrations.length}
          </strong>

        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="registrations-table-card">

        {filteredRegistrations.length === 0 ? (

          <div className="registrations-empty">

            <div className="empty-icon">
              <FaUsers />
            </div>

            <h3>
              No registrations found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="registrations-table-wrapper">

            <table className="registrations-table">

              <thead>

                <tr>

                  <th>#</th>

                  <th>
                    Participant
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Webinar
                  </th>

                  <th>
                    Registered
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredRegistrations.map(
                  (registration, index) => (

                    <tr
                      key={
                        registration.id
                      }
                    >

                      <td>

                        <span className="registration-number">
                          {index + 1}
                        </span>

                      </td>


                      <td>

                        <div className="participant-cell">

                          <div className="participant-avatar">

                            {(
                              registration.first_name ||
                              'U'
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>

                              {registration.first_name}{' '}

                              {registration.last_name}

                            </strong>

                            <span>

                              {registration.city ||
                                'City not provided'}

                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <div className="contact-cell">

                          <span>
                            <FaEnvelope />

                            {registration.email}
                          </span>

                          <span>
                            <FaPhone />

                            {registration.phone}
                          </span>

                        </div>

                      </td>


                      <td>

                        <span className="role-badge">

                          {registration.role ||
                            '-'}

                        </span>

                      </td>


                      <td>

                        <div className="webinar-cell">

                          {registration.webinar_title ||
                            'Webinar'}

                        </div>

                      </td>


                      <td>

                        <div className="date-cell">

                          <FaCalendarAlt />

                          {formatDate(
                            registration.registered_at
                          )}

                        </div>

                      </td>


                      <td>

                        {getPaymentStatus(
                          registration.payment_status
                        )}

                      </td>


                      <td>

                        {getRegistrationStatus(
                          registration.registration_status
                        )}

                      </td>


                      <td>

                        <button
                          className="view-registration-btn"
                          onClick={() =>
                            handleViewDetails(
                              registration
                            )
                          }
                        >

                          <FaEye />

                          View

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedRegistration && (

        <div
          className="registration-modal-overlay"
          onClick={
            handleCloseDetails
          }
        >

          <div
            className="registration-modal"
            onClick={
              e =>
                e.stopPropagation()
            }
          >


            {/* Modal Header */}

            <div className="registration-modal-header">

              <div>

                <span>
                  Registration Details
                </span>

                <h2>

                  {selectedRegistration.first_name}{' '}

                  {selectedRegistration.last_name}

                </h2>

              </div>


              <button
                onClick={
                  handleCloseDetails
                }
                className="modal-close-btn"
              >

                <FaTimes />

              </button>

            </div>


            {/* Modal Body */}

            <div className="registration-modal-body">


              {/* Participant */}

              <div className="detail-section">

                <h3>
                  <FaUsers />
                  Participant Information
                </h3>


                <div className="detail-grid">

                  <div className="detail-item">

                    <span>
                      First Name
                    </span>

                    <strong>
                      {selectedRegistration.first_name || '-'}
                    </strong>

                  </div>


                  <div className="detail-item">

                    <span>
                      Last Name
                    </span>

                    <strong>
                      {selectedRegistration.last_name || '-'}
                    </strong>

                  </div>


                  <div className="detail-item">

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedRegistration.email || '-'}
                    </strong>

                  </div>


                  <div className="detail-item">

                    <span>
                      Phone
                    </span>

                    <strong>
                      {selectedRegistration.phone || '-'}
                    </strong>

                  </div>


                  <div className="detail-item">

                    <span>
                      City
                    </span>

                    <strong>
                      {selectedRegistration.city || '-'}
                    </strong>

                  </div>


                  <div className="detail-item">

                    <span>
                      Role
                    </span>

                    <strong>
                      {selectedRegistration.role || '-'}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Webinar */}

              <div className="detail-section">

                <h3>
                  <FaCalendarAlt />
                  Webinar Information
                </h3>


                <div className="detail-grid">

                  <div className="detail-item">

                    <span>
                      Webinar
                    </span>

                    <strong>
                      {selectedRegistration.webinar_title ||
                        'The Abundance Crossroad™'}
                    </strong>

                  </div>


                  <div className="detail-item">

                    <span>
                      Registered At
                    </span>

                    <strong>
                      {formatDateTime(
                        selectedRegistration.registered_at
                      )}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Payment */}

              <div className="detail-section">

                <h3>
                  <FaCreditCard />
                  Payment
                </h3>


                <div className="status-edit-row">

                  <select
                    value={
                      selectedRegistration.payment_status ||
                      'pending'
                    }
                    onChange={
                      e =>
                        handlePaymentChange(
                          e.target.value
                        )
                    }
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="paid">
                      Paid
                    </option>

                    <option value="failed">
                      Failed
                    </option>

                  </select>


                  <button
                    className="save-status-btn"
                    onClick={
                      savePaymentStatus
                    }
                    disabled={
                      savingPayment
                    }
                  >

                    <FaSave />

                    {savingPayment
                      ? 'Saving...'
                      : 'Save Payment'}

                  </button>

                </div>

              </div>


              {/* Registration Status */}

              <div className="detail-section">

                <h3>
                  <FaCheckCircle />
                  Registration Status
                </h3>


                <div className="status-edit-row">

                  <select
                    value={
                      selectedRegistration.registration_status ||
                      'registered'
                    }
                    onChange={
                      e =>
                        handleStatusChange(
                          e.target.value
                        )
                    }
                  >

                    <option value="registered">
                      Registered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>


                  <button
                    className="save-status-btn"
                    onClick={
                      saveRegistrationStatus
                    }
                    disabled={
                      savingStatus
                    }
                  >

                    <FaSave />

                    {savingStatus
                      ? 'Saving...'
                      : 'Save Status'}

                  </button>

                </div>

              </div>


              {/* Goal */}

              <div className="detail-section">

                <h3>
                  Participant Goal
                </h3>


                <div className="goal-box">

                  {
                    selectedRegistration.goal ||
                    'No goal provided.'
                  }

                </div>

              </div>


              {/* Consent */}

              <div className="detail-section">

                <h3>
                  Consent
                </h3>


                <div className="consent-box">

                  {
                    selectedRegistration.consent
                      ? 'Consent accepted'
                      : 'Consent not provided'
                  }

                </div>

              </div>

            </div>


            {/* Footer */}

            <div className="registration-modal-footer">

              <button
                onClick={
                  handleCloseDetails
                }
                className="modal-done-btn"
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default RegistrationsAdmin;