const STORAGE_KEY = 'hms_appointments_v1';

const loadAppointments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveAppointments = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const fetchAppointments = async () => {
  return loadAppointments();
};

export const addAppointment = async (appt) => {
  const items = loadAppointments();
  const newItem = { id: `APPT-${Date.now()}`, ...appt };
  const next = [newItem, ...items];
  saveAppointments(next);
  return newItem;
};

export const deleteAppointment = async (id) => {
  const items = loadAppointments();
  const next = items.filter((a) => a.id !== id);
  saveAppointments(next);
};

export const fetchAppointmentsByDoctor = async (doctorId) => {
  const items = loadAppointments();
  return items.filter((a) => a.doctorId === doctorId);
};

export default {
  fetchAppointments,
  addAppointment,
  deleteAppointment,
  fetchAppointmentsByDoctor,
};
