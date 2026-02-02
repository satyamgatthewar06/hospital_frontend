import axios from './axiosConfig';

const API_URL = '/patients';
const DISABLE_API = process.env.REACT_APP_DISABLE_API === 'true';

// Fetch all patients
export const fetchPatients = async () => {
    if (DISABLE_API) return [];
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return [];
    }
};

// Add a new patient
export const addPatient = async (patientData) => {
    if (DISABLE_API) return patientData;
    try {
        const response = await axios.post(API_URL, patientData);
        return response.data;
    } catch (error) {
        return patientData;
    }
};

// Update an existing patient
export const updatePatient = async (patientId, patientData) => {
    if (DISABLE_API) return patientData;
    try {
        const response = await axios.put(`${API_URL}/${patientId}`, patientData);
        return response.data;
    } catch (error) {
        return patientData;
    }
};

// Count OPD patients
export const countOPDPatients = async () => {
    if (DISABLE_API) return 0;
    try {
        const response = await axios.get(`${API_URL}/count/opd`);
        return response.data.count;
    } catch (error) {
        return 0;
    }
};

// Count IPD patients
export const countIPDPatients = async () => {
    if (DISABLE_API) return 0;
    try {
        const response = await axios.get(`${API_URL}/count/ipd`);
        return response.data.count;
    } catch (error) {
        return 0;
    }
};

// Backwards-compatible aliases
export const getOPDPatientCount = countOPDPatients;
export const getIPDPatientCount = countIPDPatients;