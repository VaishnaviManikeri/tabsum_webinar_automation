import { useEffect, useState } from 'react';

import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaSync,
  FaMoneyBillWave,
  FaEye
} from 'react-icons/fa';

import {
  registrationAPI
} from '../../api';

import './RegistrationsAdmin.css';


const RegistrationsAdmin = () => {

  const [registrations, setRegistrations] =
    useState([]);

  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    cancelled: 0,
    payment_pending: 0,
    payment_paid: 0,
    payment_failed: 0
  });


  const [search, setSearch] =
    useState('');

  const [
    paymentStatus,
    setPaymentStatus
  ] = useState('all');


  const [
    registrationStatus,
    setRegistrationStatus
  ] = useState('all');


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  const [
    selectedRegistration,
    setSelectedRegistration
  ] = useState(null);


  // ===================================================
  // LOAD DATA
  // ===================================================

  const loadRegistrations = async () => {

    try {

      setLoading(true);
      setError('');


      const [
        registrationsResponse,
        statsResponse
      ] = await Promise.all([

        registrationAPI.getAll({
          search,
          payment_status: paymentStatus,
          registration_status:
            registrationStatus
        }),

        registrationAPI.getStats()

      ]);


      setRegistrations(
        registrationsResponse.data
          ?.registrations || []
      );


      setStats(
        statsResponse.data?.stats || {}
      );


    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        'Unable to load registrations'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    const timer = setTimeout(() => {

      loadRegistrations();

    }, 300);


    return () => clearTimeout(timer);

  }, [
    search,
    paymentStatus,
    registrationStatus
  ]);


  // ===================================================
  // PAYMENT STATUS
  // ===================================================

  const handlePaymentStatus = async (
    id,
    newStatus
  ) => {

    try {

      await registrationAPI
        .updatePaymentStatus(
          id,
          newStatus
        );


      loadRegistrations();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        'Unable to update payment status'
      );

    }
  };


  // ===================================================
  // REGISTRATION STATUS
  // ===================================================

  const handleRegistrationStatus =
    async (
      id,
      newStatus
    ) => {

      try {

        await registrationAPI
          .updateRegistrationStatus(
            id,
            newStatus
          );


        loadRegistrations();

      } catch (err) {

        alert(
          err.response?.data?.message ||
          'Unable to update registration status'
        );

      }
    };


  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDate = (date) => {

    if (!date) {
      return '-';
    }


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
  };


  // ===================================================
  // VIEW REGISTRATION
  // ===================================================

  const handleView = (registration) => {

    setSelectedRegistration(
      registration
    );

  };


  return (

    <div className="registrations-page">

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
            Manage webinar registrations,
            payments and registration status.
          </p>

        </div>


        <button
          className="registrations-refresh"
          onClick={loadRegistrations}
          disabled={loading}
        >

          <FaSync
            className={
              loading
                ? 'registration-spin'
                : ''
            }
          />

          Refresh

        </button>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="registrations-stats">

        <div className="registration-stat">

          <div className="registration-stat-icon">
            <FaUsers />
          </div>

          <div>

            <span>
              Total
            </span>

            <strong>
              {stats.total || 0}
            </strong>

          </div>

        </div>


        <div className="registration-stat">

          <div className="registration-stat-icon">
            <FaCheckCircle />
          </div>

          <div>

            <span>
              Registered
            </span>

            <strong>
              {stats.registered || 0}
            </strong>

          </div>

        </div>


        <div className="registration-stat">

          <div className="registration-stat-icon">
            <FaMoneyBillWave />
          </div>

          <div>

            <span>
              Paid
            </span>

            <strong>
              {stats.payment_paid || 0}
            </strong>

          </div>

        </div>


        <div className="registration-stat">

          <div className="registration-stat-icon">
            <FaClock />
          </div>

          <div>

            <span>
              Payment Pending
            </span>

            <strong>
              {stats.payment_pending || 0}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="registrations-card">

        <div className="registrations-card-header">

          <div>

            <h2>
              Webinar Registrations
            </h2>

            <p>
              All users who submitted
              the registration form.
            </p>

          </div>


          <div className="registration-count">

            {registrations.length}
            {' '}
            Registrations

          </div>

        </div>


        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="registration-filters">

          <div className="registration-search">

            <FaSearch />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search name, email, phone..."
            />

          </div>


          <select
            value={paymentStatus}
            onChange={(e) =>
              setPaymentStatus(
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


          <select
            value={registrationStatus}
            onChange={(e) =>
              setRegistrationStatus(
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


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="registrations-error">
            {error}
          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="registrations-table-wrapper">

          <table className="registrations-table">

            <thead>

              <tr>

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
                  City
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
                  View
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="registration-empty"
                  >
                    Loading registrations...
                  </td>

                </tr>

              ) : registrations.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="registration-empty"
                  >
                    <FaUsers />

                    <span>
                      No registrations found
                    </span>

                  </td>

                </tr>

              ) : (

                registrations.map(
                  (registration) => (

                    <tr
                      key={
                        registration.id
                      }
                    >

                      {/* Participant */}

                      <td>

                        <div className="participant">

                          <div className="participant-avatar">

                            {registration.first_name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>


                          <div>

                            <strong>

                              {registration.first_name}
                              {' '}
                              {registration.last_name}

                            </strong>

                            <span>

                              #
                              {registration.id}

                            </span>

                          </div>

                        </div>

                      </td>


                      {/* Contact */}

                      <td>

                        <div className="participant-contact">

                          <strong>
                            {registration.email}
                          </strong>

                          <span>
                            {registration.phone}
                          </span>

                        </div>

                      </td>


                      {/* Role */}

                      <td>

                        {registration.role ||
                          '-'}

                      </td>


                      {/* City */}

                      <td>

                        {registration.city ||
                          '-'}

                      </td>


                      {/* Date */}

                      <td>

                        {formatDate(
                          registration.registered_at
                        )}

                      </td>


                      {/* Payment */}

                      <td>

                        <select
                          className={`payment-status payment-${registration.payment_status}`}
                          value={
                            registration.payment_status
                          }
                          onChange={(e) =>
                            handlePaymentStatus(
                              registration.id,
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

                      </td>


                      {/* Registration status */}

                      <td>

                        <select
                          className={`registration-status registration-${registration.registration_status}`}
                          value={
                            registration.registration_status
                          }
                          onChange={(e) =>
                            handleRegistrationStatus(
                              registration.id,
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

                      </td>


                      {/* View */}

                      <td>

                        <button
                          className="view-registration"
                          onClick={() =>
                            handleView(
                              registration
                            )
                          }
                          title="View registration"
                        >

                          <FaEye />

                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {selectedRegistration && (

        <div
          className="registration-modal-overlay"
          onClick={() =>
            setSelectedRegistration(
              null
            )
          }
        >

          <div
            className="registration-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="registration-modal-header">

              <div>

                <span>
                  Registration #
                  {selectedRegistration.id}
                </span>

                <h2>

                  {selectedRegistration.first_name}
                  {' '}
                  {selectedRegistration.last_name}

                </h2>

              </div>


              <button
                onClick={() =>
                  setSelectedRegistration(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="registration-details">

              <div>
                <label>
                  Email
                </label>

                <strong>
                  {selectedRegistration.email}
                </strong>
              </div>


              <div>
                <label>
                  Phone
                </label>

                <strong>
                  {selectedRegistration.phone}
                </strong>
              </div>


              <div>
                <label>
                  City
                </label>

                <strong>
                  {selectedRegistration.city ||
                    '-'}
                </strong>
              </div>


              <div>
                <label>
                  Role
                </label>

                <strong>
                  {selectedRegistration.role ||
                    '-'}
                </strong>
              </div>


              <div className="registration-detail-full">

                <label>
                  Decision / Goal
                </label>

                <p>
                  {selectedRegistration.goal ||
                    'No response provided.'}
                </p>

              </div>


              <div>

                <label>
                  Payment
                </label>

                <strong>
                  {selectedRegistration.payment_status}
                </strong>

              </div>


              <div>

                <label>
                  Registration Status
                </label>

                <strong>
                  {selectedRegistration.registration_status}
                </strong>

              </div>


              <div>

                <label>
                  Registered On
                </label>

                <strong>
                  {formatDate(
                    selectedRegistration.registered_at
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


export default RegistrationsAdmin;