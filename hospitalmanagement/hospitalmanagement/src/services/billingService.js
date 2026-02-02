import axios from './axiosConfig';

const API_URL = '/billing'; // Use axios baseURL
const DISABLE_API = process.env.REACT_APP_DISABLE_API === 'true';
const STORAGE_KEY = 'hms_billing_records_v1';

const loadLocal = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
};

const saveLocal = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const getBillingRecords = async () => {
    if (DISABLE_API) return loadLocal();
    try {
        const response = await axios.get(`${API_URL}/records`);
        return response.data;
    } catch (error) {
        return [];
    }
};

export const addBillingRecord = async (record) => {
    if (DISABLE_API) {
        const items = loadLocal();
        const id = `BILL-${Date.now()}`;
        const newRecord = { id, createdAt: new Date().toISOString(), ...record };
        const next = [newRecord, ...items];
        saveLocal(next);
        return newRecord;
    }
    try {
        const response = await axios.post(`${API_URL}/records`, record);
        return response.data;
    } catch (error) {
        return {};
    }
};

export const updateBillingRecord = async (id, updatedRecord) => {
    if (DISABLE_API) {
        const items = loadLocal();
        const next = items.map((r) => (r.id === id ? { ...r, ...updatedRecord } : r));
        saveLocal(next);
        return next.find((r) => r.id === id);
    }
    try {
        const response = await axios.put(`${API_URL}/records/${id}`, updatedRecord);
        return response.data;
    } catch (error) {
        return updatedRecord;
    }
};

export const getMonthlyAccounts = async () => {
    if (DISABLE_API) return [];
    try {
        const response = await axios.get(`${API_URL}/monthly`);
        return response.data;
    } catch (error) {
        return [];
    }
};

export const getYearlyAccounts = async () => {
    if (DISABLE_API) return [];
    try {
        const response = await axios.get(`${API_URL}/yearly`);
        return response.data;
    } catch (error) {
        return [];
    }
};

// Backwards-compatible aliases for components that import older function names
export const fetchBillingRecords = getBillingRecords;
export const fetchMonthlyAccounts = getMonthlyAccounts;
export const fetchYearlyAccounts = getYearlyAccounts;