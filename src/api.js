import axios from 'axios';


// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    'Content-Type': 'application/json'
  },

  timeout: 15000,

  withCredentials: true
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================
// Automatically attach admin JWT token to protected APIs
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem('adminToken');


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================
// Handle expired / invalid admin token
// =====================================================

api.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        'adminToken'
      );

      localStorage.removeItem(
        'adminData'
      );


      // Avoid redirect loop
      if (
        window.location.pathname !==
        '/admin/login'
      ) {

        window.location.href =
          '/admin/login';

      }

    }


    return Promise.reject(error);

  }
);


// =====================================================
// WEBINAR API
// =====================================================

export const webinarAPI = {

  // Get current/latest webinar
  getAll: () =>
    api.get('/webinar'),

};


// =====================================================
// LEAD API
// =====================================================

export const leadAPI = {

  // ---------------------------------------------------
  // Get all leads
  // ---------------------------------------------------

  getAll: (params = {}) =>
    api.get(
      '/leads',
      {
        params
      }
    ),


  // ---------------------------------------------------
  // Get lead statistics
  // ---------------------------------------------------

  getStats: () =>
    api.get(
      '/leads/stats'
    ),


  // ---------------------------------------------------
  // Get single lead
  // ---------------------------------------------------

  getById: (id) =>
    api.get(
      `/leads/${id}`
    ),


  // ---------------------------------------------------
  // Update lead status
  // ---------------------------------------------------

  updateStatus: (
    id,
    lead_status
  ) =>
    api.put(
      `/leads/${id}/status`,
      {
        lead_status
      }
    )

};


// =====================================================
// REGISTRATION API
// =====================================================

export const registrationAPI = {

  // ---------------------------------------------------
  // Create registration
  // ---------------------------------------------------
  // Used by public Registration.jsx
  // ---------------------------------------------------

  create: (data) =>
    api.post(
      '/registrations',
      data
    ),


  // ---------------------------------------------------
  // Get all registrations
  // ---------------------------------------------------
  // Protected admin API
  // ---------------------------------------------------

  getAll: (params = {}) =>
    api.get(
      '/registrations',
      {
        params
      }
    ),


  // ---------------------------------------------------
  // Get registration statistics
  // ---------------------------------------------------

  getStats: () =>
    api.get(
      '/registrations/stats'
    ),


  // ---------------------------------------------------
  // Get single registration
  // ---------------------------------------------------

  getById: (id) =>
    api.get(
      `/registrations/${id}`
    ),


  // ---------------------------------------------------
  // Update payment status
  // ---------------------------------------------------

  updatePaymentStatus: (
    id,
    payment_status
  ) =>
    api.put(
      `/registrations/${id}/payment`,
      {
        payment_status
      }
    ),


  // ---------------------------------------------------
  // Update registration status
  // ---------------------------------------------------

  updateRegistrationStatus: (
    id,
    registration_status
  ) =>
    api.put(
      `/registrations/${id}/status`,
      {
        registration_status
      }
    )

};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;