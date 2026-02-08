import React, { createContext, useState, useEffect } from 'react';
import {
  patientAPI,
  doctorAPI,
  appointmentAPI,
  billingAPI,
  laboratoryAPI,
  staffAPI,
  wardAPI,
  tpaAPI,
  insuranceAPI,
  opdAPI,
  authAPI,
  ipdAPI,
} from '../services/api';
import ipdDetailsAPI from '../services/ipdDetailsAPI';

// Step 1: Create the context
export const HospitalContext = createContext();

// Step 2: Create the Provider component
export function HospitalProvider({ children }) {
  // ==================== STATE MANAGEMENT ====================

  // Data State
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bills, setBills] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [labBills, setLabBills] = useState([]);
  const [wards, setWards] = useState([]);
  const [tpaRecords, setTPARecords] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [insuranceClaims, setInsuranceClaims] = useState([]);
  const [opdRecords, setOpdRecords] = useState([]);

  // User & Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  // Loading & Error State
  const [loading, setLoading] = useState({
    patients: false,
    doctors: false,
    appointments: false,
    billing: false,
    laboratory: false,
    staff: false,
    wards: false,
    tpa: false,
    insurance: false,
    opd: false,
  });

  const [errors, setErrors] = useState({
    patients: null,
    doctors: null,
    appointments: null,
    billing: null,
    laboratory: null,
    staff: null,
    wards: null,
    tpa: null,
    insurance: null,
    opd: null,
  });

  // ==================== FETCH DATA FUNCTIONS ====================

  // Fetch Patients from Backend
  const fetchPatients = async () => {
    try {
      setLoading(prev => ({ ...prev, patients: true }));
      const response = await patientAPI.getAll();
      setPatients(response.data.data || response.data);
      setErrors(prev => ({ ...prev, patients: null }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      setErrors(prev => ({ ...prev, patients: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, patients: false }));
    }
  };

  // Fetch Doctors from Backend
  const fetchDoctors = async () => {
    try {
      setLoading(prev => ({ ...prev, doctors: true }));
      const response = await doctorAPI.getAll();
      setDoctors(response.data.data || response.data);
      setErrors(prev => ({ ...prev, doctors: null }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setErrors(prev => ({ ...prev, doctors: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, doctors: false }));
    }
  };

  // Fetch Appointments from Backend
  const fetchAppointments = async () => {
    try {
      setLoading(prev => ({ ...prev, appointments: true }));
      const response = await appointmentAPI.getAll();
      setAppointments(response.data.data || response.data);
      setErrors(prev => ({ ...prev, appointments: null }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setErrors(prev => ({ ...prev, appointments: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  };

  // Fetch Bills from Backend
  const fetchBills = async () => {
    try {
      setLoading(prev => ({ ...prev, billing: true }));
      const response = await billingAPI.getAll();
      setBills(response.data.data || response.data);
      setErrors(prev => ({ ...prev, billing: null }));
    } catch (error) {
      console.error('Error fetching bills:', error);
      setErrors(prev => ({ ...prev, billing: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, billing: false }));
    }
  };

  // Fetch Laboratory Data (Tests, Requests, Bills)
  const fetchLabData = async () => {
    try {
      setLoading(prev => ({ ...prev, laboratory: true }));
      const [testsRes, requestsRes, billsRes] = await Promise.all([
        laboratoryAPI.getAllTests(),
        laboratoryAPI.getAllRequests(),
        laboratoryAPI.getAllBills()
      ]);
      setLabTests(testsRes.data.data || testsRes.data);
      setLabRequests(requestsRes.data.data || requestsRes.data);
      setLabBills(billsRes.data.data || billsRes.data);
      setErrors(prev => ({ ...prev, laboratory: null }));
    } catch (error) {
      console.error('Error fetching lab data:', error);
      setErrors(prev => ({ ...prev, laboratory: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, laboratory: false }));
    }
  };

  // Fetch Staff from Backend
  const fetchStaff = async () => {
    try {
      setLoading(prev => ({ ...prev, staff: true }));
      const response = await staffAPI.getAll();
      setStaff(response.data.data || response.data);
      setErrors(prev => ({ ...prev, staff: null }));
    } catch (error) {
      console.error('Error fetching staff:', error);
      setErrors(prev => ({ ...prev, staff: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, staff: false }));
    }
  };

  // Fetch Wards from Backend
  const fetchWards = async () => {
    try {
      setLoading(prev => ({ ...prev, wards: true }));
      const response = await wardAPI.getAll();
      setWards(response.data.data || response.data);
      setErrors(prev => ({ ...prev, wards: null }));
    } catch (error) {
      console.error('Error fetching wards:', error);
      setErrors(prev => ({ ...prev, wards: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  // Fetch TPA Records from Backend
  const fetchTPARecords = async () => {
    try {
      setLoading(prev => ({ ...prev, tpa: true }));
      const response = await tpaAPI.getAll();
      setTPARecords(response.data.data || response.data);
      setErrors(prev => ({ ...prev, tpa: null }));
    } catch (error) {
      console.error('Error fetching TPA records:', error);
      setErrors(prev => ({ ...prev, tpa: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, tpa: false }));
    }
  };

  // Fetch Insurance Data from Backend
  const fetchInsuranceData = async () => {
    try {
      setLoading(prev => ({ ...prev, insurance: true }));
      const [policiesRes, claimsRes] = await Promise.all([
        insuranceAPI.policies.getAll(),
        insuranceAPI.claims.getAll(),
      ]);
      setInsurancePolicies(policiesRes.data.data || policiesRes.data);
      setInsuranceClaims(claimsRes.data.data || claimsRes.data);
      setErrors(prev => ({ ...prev, insurance: null }));
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      setErrors(prev => ({ ...prev, insurance: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, insurance: false }));
    }
  };

  // Fetch OPD Records from Backend
  const fetchOPDRecords = async () => {
    try {
      setLoading(prev => ({ ...prev, opd: true }));
      const response = await opdAPI.getAll();
      setOpdRecords(response.data.data || response.data);
      setErrors(prev => ({ ...prev, opd: null }));
    } catch (error) {
      console.error('Error fetching OPD records:', error);
      setErrors(prev => ({ ...prev, opd: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, opd: false }));
    }
  };

  // ==================== CREATE FUNCTIONS ====================

  // Add Patient via Backend
  const addPatient = async (patientData) => {
    try {
      const response = await patientAPI.create(patientData);
      setPatients(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };

  // Add Doctor via Backend
  const addDoctor = async (doctorData) => {
    try {
      const response = await doctorAPI.create(doctorData);
      setDoctors(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw error;
    }
  };

  // Add OPD Record
  const addOPDRecord = async (opdData) => {
    try {
      const response = await opdAPI.create(opdData);
      setOpdRecords(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding OPD record:', error);
      throw error;
    }
  };

  // Add Appointment via Backend
  const addAppointment = async (appointmentData) => {
    try {
      const response = await appointmentAPI.create(appointmentData);
      setAppointments(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  // Add Bill via Backend
  const addBill = async (billData) => {
    try {
      const response = await billingAPI.create(billData);
      setBills(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding bill:', error);
      throw error;
    }
  };

  // Add Staff via Backend
  const addStaff = async (staffData) => {
    try {
      const response = await staffAPI.create(staffData);
      setStaff(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding staff:', error);
      throw error;
    }
  };

  // Add Insurance Policy
  const addInsurancePolicy = async (policyData) => {
    try {
      const response = await insuranceAPI.policies.create(policyData);
      setInsurancePolicies(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding insurance policy:', error);
      throw error;
    }
  };

  // Add Lab Test (Master)
  const addLabTest = async (testData) => {
    try {
      const response = await laboratoryAPI.createTest(testData);
      setLabTests(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding lab test:', error);
      throw error;
    }
  };

  // Add Lab Request (Sample Collection)
  const addLabRequest = async (requestData) => {
    try {
      const response = await laboratoryAPI.createRequest(requestData);
      setLabRequests(prev => [response.data.data || response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding lab request:', error);
      throw error;
    }
  };

  // Add Lab Bill
  const addLabBill = async (billData) => {
    try {
      const response = await laboratoryAPI.createBill(billData);
      setLabBills(prev => [response.data.data || response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding lab bill:', error);
      throw error;
    }
  };

  // ==================== UPDATE FUNCTIONS ====================

  // Update Bill Payment
  const updateBillPayment = async (billId, updates) => {
    try {
      const response = await billingAPI.updatePayment(billId, updates);
      setBills(prev => prev.map(b => b.id === billId ? response.data.data || response.data : b));
      return response.data;
    } catch (error) {
      console.error('Error updating bill payment:', error);
      throw error;
    }
  };

  // Update Test Results / Status
  const updateLabRequest = async (id, updates) => {
    try {
      const response = await laboratoryAPI.updateRequest(id, updates);
      setLabRequests(prev => prev.map(r => r.id === id ? (response.data.data || response.data) : r));
      return response.data;
    } catch (error) {
      console.error('Error updating lab request:', error);
      throw error;
    }
  };

  // Update Lab Test Master
  const updateLabTest = async (id, updates) => {
    try {
      const response = await laboratoryAPI.updateTest(id, updates);
      setLabTests(prev => prev.map(t => t.id === id ? (response.data.data || response.data) : t));
      return response.data;
    } catch (error) {
      console.error('Error updating lab test:', error);
      throw error;
    }
  };

  // Delete Lab Test Master
  const deleteLabTest = async (id) => {
    try {
      await laboratoryAPI.deleteTest(id);
      setLabTests(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting lab test:', error);
      throw error;
    }
  };

  // ==================== DELETE FUNCTIONS ====================

  // Delete Patient
  const deletePatient = async (patientId) => {
    try {
      await patientAPI.delete(patientId);
      setPatients(prev => prev.filter(p => p.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  };

  // Delete Doctor
  const deleteDoctor = async (doctorId) => {
    try {
      await doctorAPI.delete(doctorId);
      setDoctors(prev => prev.filter(d => d.id !== doctorId));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  };

  // Delete Appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.delete(appointmentId);
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  // ==================== AUTHENTICATION FUNCTIONS ====================

  // Login Function
  const login = async (username, password) => {
    try {
      setLoading(prev => ({ ...prev, patients: true }));
      const response = await authAPI.login({ email: username, password });
      const user = response.data.user || response.data;
      const token = response.data.token;

      setCurrentUser(user);
      setIsAuthenticated(true);
      if (token) {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
      }
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Fetch all data after successful login
      await Promise.all([
        fetchPatients(),
        fetchDoctors(),
        fetchAppointments(),
        fetchBills(),
        fetchBills(),
        fetchLabData(),
        fetchStaff(),
        fetchWards(),
        fetchTPARecords(),
        fetchInsuranceData(),
      ]);

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, patients: false }));
    }
  };

  // Logout Function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Clear all data
    setPatients([]);
    setDoctors([]);
    setAppointments([]);
    setBills([]);
    setBills([]);
    setLabTests([]);
    setLabRequests([]);
    setLabBills([]);
    setStaff([]);
    setWards([]);
    setTPARecords([]);
    setInsurancePolicies([]);
    setInsuranceClaims([]);
  };

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setAuthToken(storedToken);

        // Optionally validate token with backend
        authAPI
          .getCurrentUser()
          .then(() => {
            // Token is valid, fetch data
            Promise.all([
              fetchPatients(),
              fetchDoctors(),
              fetchAppointments(),
              fetchBills(),
              fetchBills(),
              fetchLabData(),
              fetchStaff(),
              fetchWards(),
              fetchTPARecords(),
              fetchInsuranceData(),
              fetchOPDRecords(),
            ]);
          })
          .catch(() => {
            // Token is invalid, logout
            logout();
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
  }, []);

  // Step 4: Provide all data to the app
  return (
    <HospitalContext.Provider
      value={{
        // Data
        patients,
        doctors,
        staff,
        bills,
        appointments,
        appointments,
        labTests,
        labRequests,
        labBills,
        wards,
        tpaRecords,
        insurancePolicies,
        insuranceClaims,
        opdRecords,

        // IPD Details API
        // IPD Details API
        ipdDetailsAPI,
        ipdAPI,

        // Auth
        currentUser,
        isAuthenticated,
        authToken,
        login,
        logout,

        // Fetch Functions
        fetchPatients,
        fetchDoctors,
        fetchAppointments,
        fetchBills,
        fetchLabData,
        fetchStaff,
        fetchWards,
        fetchTPARecords,
        fetchInsuranceData,
        fetchOPDRecords,

        // Add Functions
        addPatient,
        addDoctor,
        addAppointment,
        addBill,
        addStaff,
        addLabTest,
        addLabRequest,
        addLabBill,
        addOPDRecord,
        addInsurancePolicy,

        // Update Functions
        updateBillPayment,
        updateLabRequest,
        updateLabTest,
        deleteLabTest,

        // Delete Functions
        deletePatient,
        deleteDoctor,
        deleteAppointment,

        // Loading & Error State
        loading,
        errors,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}