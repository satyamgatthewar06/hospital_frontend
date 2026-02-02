import axios from './axiosConfig';

const API_URL = '/doctors';
const DISABLE_API = process.env.REACT_APP_DISABLE_API === 'true';
const STORAGE_KEY = 'hms_doctors_v1';

// Sample data
const SAMPLE_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    email: 'rajesh.kumar@hospital.com',
    phone: '+91-9876543210',
    availability: 'Mon-Fri 9AM-5PM'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialization: 'Neurology',
    email: 'priya.sharma@hospital.com',
    phone: '+91-9876543211',
    availability: 'Tue-Sat 10AM-6PM'
  },
  {
    id: 3,
    name: 'Dr. Amit Singh',
    specialization: 'Orthopedics',
    email: 'amit.singh@hospital.com',
    phone: '+91-9876543212',
    availability: 'Mon-Thu 8AM-4PM'
  }
];

// Initialize localStorage with sample data if empty
const initializeStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DOCTORS));
  }
};

// Get all doctors from localStorage
const getDoctorList = () => {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : SAMPLE_DOCTORS;
  } catch (err) {
    return SAMPLE_DOCTORS;
  }
};

// Save doctors to localStorage
const saveDoctors = (doctors) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
};

// Fetch all doctors
export const fetchDoctors = async () => {
    if (DISABLE_API) return getDoctorList();
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return getDoctorList();
    }
};

// Fetch a doctor by ID
export const fetchDoctorById = async (id) => {
    try {
        const doctors = getDoctorList();
        return doctors.find(d => d.id === id) || null;
    } catch (error) {
        return null;
    }
};

// Add a new doctor
export const addDoctor = async (doctorData) => {
    try {
        const doctors = getDoctorList();
        const newDoctor = {
            ...doctorData,
            id: Date.now()
        };
        doctors.push(newDoctor);
        saveDoctors(doctors);
        return newDoctor;
    } catch (error) {
        return doctorData;
    }
};

// Update an existing doctor
export const updateDoctor = async (id, doctorData) => {
    try {
        const doctors = getDoctorList();
        const index = doctors.findIndex(d => d.id === id);
        if (index !== -1) {
            doctors[index] = { ...doctors[index], ...doctorData, id };
            saveDoctors(doctors);
        }
        return doctorData;
    } catch (error) {
        return doctorData;
    }
};

// Delete a doctor
export const deleteDoctor = async (id) => {
    try {
        const doctors = getDoctorList();
        const filtered = doctors.filter(d => d.id !== id);
        saveDoctors(filtered);
        return {};
    } catch (error) {
        // silently fail
    }
};

// Export a service object for use in components
const doctorService = {
  getDoctorList,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  fetchDoctorById,
  fetchDoctors
};

export default doctorService;