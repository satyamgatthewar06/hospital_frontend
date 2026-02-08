import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Helper to get headers
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

const ipdDetailsAPI = {
    // Nursing Notes
    getNursingNotes: (ipdId) => axios.get(`${API_URL}/ipd-details/${ipdId}/nursing-notes`, getHeaders()),
    addNursingNote: (ipdId, data) => axios.post(`${API_URL}/ipd-details/${ipdId}/nursing-notes`, data, getHeaders()),

    // Doctor Rounds
    getDoctorRounds: (ipdId) => axios.get(`${API_URL}/ipd-details/${ipdId}/doctor-rounds`, getHeaders()),
    addDoctorRound: (ipdId, data) => axios.post(`${API_URL}/ipd-details/${ipdId}/doctor-rounds`, data, getHeaders()),

    // Medications
    getMedications: (ipdId) => axios.get(`${API_URL}/ipd-details/${ipdId}/medications`, getHeaders()),
    addMedication: (ipdId, data) => axios.post(`${API_URL}/ipd-details/${ipdId}/medications`, data, getHeaders()),

    // Intake / Output
    getIntakeOutput: (ipdId) => axios.get(`${API_URL}/ipd-details/${ipdId}/intake-output`, getHeaders()),
    addIntakeOutput: (ipdId, data) => axios.post(`${API_URL}/ipd-details/${ipdId}/intake-output`, data, getHeaders()),

    // OT Schedules
    getOTSchedules: (ipdId) => axios.get(`${API_URL}/ipd-details/${ipdId}/ot-schedules`, getHeaders()),
    addOTSchedule: (ipdId, data) => axios.post(`${API_URL}/ipd-details/${ipdId}/ot-schedules`, data, getHeaders()),
};

export default ipdDetailsAPI;
