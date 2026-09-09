import axios from 'axios';


// ==================================================
// API URL
// ==================================================

export const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';


// ==================================================
// BACKEND URL
// Used for uploaded images
// ==================================================

const BACKEND_URL =
  API_URL.replace(/\/api\/?$/, '');


// ==================================================
// AXIOS INSTANCE
// ==================================================

const api = axios.create({

  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json'
  }

});


// ==================================================
// REQUEST INTERCEPTOR
// ==================================================

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


// ==================================================
// RESPONSE INTERCEPTOR
// ==================================================

api.interceptors.response.use(

  (response) => {

    // Normalize webinar data
    if (
      response.config.url === '/webinar' &&
      response.data?.data
    ) {

      response.data.data =
        normalizeWebinar(
          response.data.data
        );

    }

    return response;

  },


  (error) => {

    // Admin authentication expired
    //
    // Only redirect when an admin token exists.
    // Public APIs should not redirect users to admin login.

    if (
      error.response?.status === 401 &&
      localStorage.getItem('adminToken')
    ) {

      localStorage.removeItem(
        'adminToken'
      );

      localStorage.removeItem(
        'adminData'
      );

      window.location.href =
        '/admin/login';

    }

    return Promise.reject(error);

  }

);


// ==================================================
// NORMALIZE WEBINAR
// ==================================================

const normalizeWebinar = (
  webinar
) => {

  if (!webinar) {
    return null;
  }


  return {

    ...webinar,

    description:
      webinar.description ||
      webinar.subtitle,

    backgroundImage:
      webinar.backgroundImage ||
      (
        webinar.background_image
          ? `${BACKEND_URL}${webinar.background_image}`
          : null
      )

  };

};


// ==================================================
// WEBINAR API
// ==================================================

export const webinarAPI = {

  getAll: async () => {

    const response =
      await api.get(
        '/webinar'
      );


    const webinar =
      normalizeWebinar(
        response.data.data
      );


    return {

      ...response,

      data: {

        ...response.data,

        data:
          webinar
            ? [webinar]
            : []

      }

    };

  }

};


// ==================================================
// REGISTRATION API
// ==================================================

export const registrationAPI = {


  // --------------------------------------------------
  // PUBLIC REGISTRATION
  // --------------------------------------------------

  create: async (
    registrationData
  ) => {

    const response =
      await api.post(
        '/registrations',
        registrationData
      );

    return response;

  },


  // --------------------------------------------------
  // GET ALL
  // ADMIN ONLY
  // --------------------------------------------------

  getAll: async () => {

    const response =
      await api.get(
        '/registrations'
      );

    return response;

  },


  // --------------------------------------------------
  // GET BY ID
  // ADMIN ONLY
  // --------------------------------------------------

  getById: async (id) => {

    const response =
      await api.get(
        `/registrations/${id}`
      );

    return response;

  },


  // --------------------------------------------------
  // GET STATS
  // ADMIN ONLY
  // --------------------------------------------------

  getStats: async () => {

    const response =
      await api.get(
        '/registrations/stats'
      );

    return response;

  },


  // --------------------------------------------------
  // UPDATE PAYMENT STATUS
  // ADMIN ONLY
  // --------------------------------------------------

  updatePaymentStatus: async (
    id,
    payment_status
  ) => {

    const response =
      await api.put(
        `/registrations/${id}/payment`,
        {
          payment_status
        }
      );

    return response;

  },


  // --------------------------------------------------
  // UPDATE REGISTRATION STATUS
  // ADMIN ONLY
  // --------------------------------------------------

  updateRegistrationStatus: async (
    id,
    registration_status
  ) => {

    const response =
      await api.put(
        `/registrations/${id}/status`,
        {
          registration_status
        }
      );

    return response;

  }

};


// ==================================================
// PAYMENT API
// ==================================================

export const paymentAPI = {
  createOrder: async (registrationId) => {
    const response = await api.post(
      '/payments/create-order',
      {
        registrationId
      }
    );

    return response;
  },

  verifyPayment: async ({
    registrationId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  }) => {
    const response = await api.post(
      '/payments/verify',
      {
        registrationId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      }
    );

    return response;
  }
};
// ==================================================
// LEAD API
// ==================================================

export const leadAPI = {

  getAll: (params = {}) =>
    api.get(
      '/leads',
      {
        params
      }
    ),


  getStats: () =>
    api.get(
      '/leads/stats'
    ),


  getById: (id) =>
    api.get(
      `/leads/${id}`
    ),


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


// ==================================================
// DEFAULT EXPORT
// ==================================================

export default api;