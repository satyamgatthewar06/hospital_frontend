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
  authAPI,
} from '../services/api';

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
  const [testAssignments, setTestAssignments] = useState([]);
  const [wards, setWards] = useState([]);
  const [tpaRecords, setTPARecords] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [insuranceClaims, setInsuranceClaims] = useState([]);

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

  // Fetch Laboratory Tests from Backend
  const fetchLabTests = async () => {
    try {
      setLoading(prev => ({ ...prev, laboratory: true }));
      const response = await laboratoryAPI.getAll();
      setLabTests(response.data.data || response.data);
      setErrors(prev => ({ ...prev, laboratory: null }));
    } catch (error) {
      console.error('Error fetching lab tests:', error);
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

  // Add Test Assignment
  const addTestAssignment = async (testData) => {
    try {
      const response = await laboratoryAPI.create(testData);
      setLabTests(prev => [...prev, response.data.data || response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding test:', error);
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

  // Update Test Results
  const updateTestResults = async (testId, results) => {
    try {
      const response = await laboratoryAPI.uploadResults(testId, results);
      setLabTests(prev => prev.map(t => t.id === testId ? response.data.data || response.data : t));
      return response.data;
    } catch (error) {
      console.error('Error updating test results:', error);
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
      const response = await authAPI.login({ username, password });
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
        fetchLabTests(),
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
    setLabTests([]);
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
              fetchLabTests(),
              fetchStaff(),
              fetchWards(),
              fetchTPARecords(),
              fetchInsuranceData(),
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
        labTests,
        testAssignments,
        wards,
        tpaRecords,
        insurancePolicies,
        insuranceClaims,

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
        fetchLabTests,
        fetchStaff,
        fetchWards,
        fetchTPARecords,
        fetchInsuranceData,

        // Add Functions
        addPatient,
        addDoctor,
        addAppointment,
        addBill,
        addStaff,
        addTestAssignment,

        // Update Functions
        updateBillPayment,
        updateTestResults,

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