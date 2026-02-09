import axios from 'axios';

// Get API base URL from environment variables or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login page
      // And don't clear local storage if fallback is trying to work
      const isLoginPage = window.location.pathname === '/admin/login';
      if (!isLoginPage) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== PATIENT ENDPOINTS ====================
export const patientAPI = {
  getAll: () => apiClient.get('/patients'),
  getById: (id) => apiClient.get(`/patients/${id}`),
  create: (data) => apiClient.post('/patients', data),
  update: (id, data) => apiClient.put(`/patients/${id}`, data),
  delete: (id) => apiClient.delete(`/patients/${id}`),
  search: (query) => apiClient.get('/patients/search', { params: { q: query } }),
};

// ==================== DOCTOR ENDPOINTS ====================
export const doctorAPI = {
  getAll: () => apiClient.get('/doctors'),
  getById: (id) => apiClient.get(`/doctors/${id}`),
  create: (data) => apiClient.post('/doctors', data),
  update: (id, data) => apiClient.put(`/doctors/${id}`, data),
  delete: (id) => apiClient.delete(`/doctors/${id}`),
  getBySpecialty: (specialty) => apiClient.get('/doctors/specialty', { params: { specialty } }),
  getAvailable: (date) => apiClient.get('/doctors/available', { params: { date } }),
};

// ==================== APPOINTMENT ENDPOINTS ====================
export const appointmentAPI = {
  getAll: () => apiClient.get('/appointments'),
  getById: (id) => apiClient.get(`/appointments/${id}`),
  create: (data) => apiClient.post('/appointments', data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  delete: (id) => apiClient.delete(`/appointments/${id}`),
  reschedule: (id, data) => apiClient.put(`/appointments/${id}/reschedule`, data),
  cancel: (id, data) => apiClient.put(`/appointments/${id}/cancel`, data),
  getByPatient: (patientId) => apiClient.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => apiClient.get(`/appointments/doctor/${doctorId}`),
  getToday: () => apiClient.get('/appointments/today'),
};

// ==================== BILLING ENDPOINTS ====================
export const billingAPI = {
  getAll: () => apiClient.get('/billing'),
  getById: (id) => apiClient.get(`/billing/${id}`),
  create: (data) => apiClient.post('/billing', data),
  update: (id, data) => apiClient.put(`/billing/${id}`, data),
  delete: (id) => apiClient.delete(`/billing/${id}`),
  updatePayment: (id, data) => apiClient.put(`/billing/${id}/payment`, data),
  getByPatient: (patientId) => apiClient.get(`/billing/patient/${patientId}`),
  getPending: () => apiClient.get('/billing/pending'),
};

// ==================== LABORATORY ENDPOINTS ====================
// ==================== LABORATORY ENDPOINTS ====================
export const laboratoryAPI = {
  // Test Master
  getAllTests: () => apiClient.get('/laboratory/tests'),
  createTest: (data) => apiClient.post('/laboratory/tests', data),
  updateTest: (id, data) => apiClient.put(`/laboratory/tests/${id}`, data),
  deleteTest: (id) => apiClient.delete(`/laboratory/tests/${id}`),

  // Requests (Sample Collection)
  getAllRequests: (params) => apiClient.get('/laboratory/requests', { params }),
  createRequest: (data) => apiClient.post('/laboratory/requests', data),
  updateRequest: (id, data) => apiClient.put(`/laboratory/requests/${id}`, data),

  // Bills
  getAllBills: () => apiClient.get('/laboratory/bills'),
  createBill: (data) => apiClient.post('/laboratory/bills', data),

  // Legacy/Helper (keeping for backward compatibility if needed, or deprecating)
  uploadResults: (id, data) => apiClient.put(`/laboratory/requests/${id}`, { ...data, status: 'Completed' }), // Mapping to updateRequest
};

// ==================== STAFF ENDPOINTS ====================
export const staffAPI = {
  getAll: () => apiClient.get('/staff'),
  getById: (id) => apiClient.get(`/staff/${id}`),
  create: (data) => apiClient.post('/staff', data),
  update: (id, data) => apiClient.put(`/staff/${id}`, data),
  delete: (id) => apiClient.delete(`/staff/${id}`),
  getByRole: (role) => apiClient.get('/staff/role', { params: { role } }),
  getByDepartment: (dept) => apiClient.get('/staff/department', { params: { dept } }),
};

// ==================== WARD/ROOM ENDPOINTS ====================
export const wardAPI = {
  getAll: () => apiClient.get('/wards'),
  getById: (id) => apiClient.get(`/wards/${id}`),
  create: (data) => apiClient.post('/wards', data),
  update: (id, data) => apiClient.put(`/wards/${id}`, data),
  delete: (id) => apiClient.delete(`/wards/${id}`),
  getAvailableBeds: () => apiClient.get('/wards/available-beds'),
  updateBedStatus: (wardId, bedNo, status) =>
    apiClient.put(`/wards/${wardId}/beds/${bedNo}`, { status }),
};

// ==================== TPA ENDPOINTS ====================
export const tpaAPI = {
  getAll: () => apiClient.get('/tpa'),
  getById: (id) => apiClient.get(`/tpa/${id}`),
  create: (data) => apiClient.post('/tpa', data),
  update: (id, data) => apiClient.put(`/tpa/${id}`, data),
  delete: (id) => apiClient.delete(`/tpa/${id}`),
  submitClaim: (id, data) => apiClient.post(`/tpa/${id}/submit`, data),
  getByPatient: (patientId) => apiClient.get(`/tpa/patient/${patientId}`),
};

// ==================== INSURANCE ENDPOINTS ====================
export const insuranceAPI = {
  policies: {
    getAll: () => apiClient.get('/insurance-policies'),
    getById: (id) => apiClient.get(`/insurance-policies/${id}`),
    create: (data) => apiClient.post('/insurance-policies', data),
    update: (id, data) => apiClient.put(`/insurance-policies/${id}`, data),
    delete: (id) => apiClient.delete(`/insurance-policies/${id}`),
    getByPatient: (patientId) => apiClient.get(`/insurance-policies/patient/${patientId}`),
  },
  claims: {
    getAll: () => apiClient.get('/insurance-claims'),
    getById: (id) => apiClient.get(`/insurance-claims/${id}`),
    create: (data) => apiClient.post('/insurance-claims', data),
    update: (id, data) => apiClient.put(`/insurance-claims/${id}`, data),
    delete: (id) => apiClient.delete(`/insurance-claims/${id}`),
    getByPatient: (patientId) => apiClient.get(`/insurance-claims/patient/${patientId}`),
    submitClaim: (id, data) => apiClient.post(`/insurance-claims/${id}/submit`, data),
  },
};

// ==================== OPD/IPD ENDPOINTS ====================
export const opdAPI = {
  getAll: () => apiClient.get('/opd'),
  getById: (id) => apiClient.get(`/opd/${id}`),
  create: (data) => apiClient.post('/opd', data),
  update: (id, data) => apiClient.put(`/opd/${id}`, data),
  delete: (id) => apiClient.delete(`/opd/${id}`),
};

export const ipdAPI = {
  getAll: () => apiClient.get('/ipd'),
  getById: (id) => apiClient.get(`/ipd/${id}`),
  create: (data) => apiClient.post('/ipd', data),
  update: (id, data) => apiClient.put(`/ipd/${id}`, data),
  delete: (id) => apiClient.delete(`/ipd/${id}`),
  discharge: (id, data) => apiClient.post(`/ipd/${id}/discharge`, data),
};

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

// ==================== REPORTS ENDPOINTS ====================
export const reportsAPI = {
  getPatientReport: (patientId) => apiClient.get(`/reports/patient/${patientId}`),
  getFinancialReport: (params) => apiClient.get('/reports/financial', { params }),
  getOccupancyReport: (params) => apiClient.get('/reports/occupancy', { params }),
  getStaffReport: (params) => apiClient.get('/reports/staff', { params }),
  exportReport: (type, params) => apiClient.get(`/reports/export/${type}`, { params }),
};

// ==================== SETTINGS ENDPOINTS ====================
export const settingsAPI = {
  get: (userId) => apiClient.get(`/settings/${userId}`),
  save: (data) => apiClient.post('/settings', data),
  delete: (userId) => apiClient.delete(`/settings/${userId}`),
};

export default apiClient;