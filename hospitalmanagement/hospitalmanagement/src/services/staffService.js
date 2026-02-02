import axios from './axiosConfig';

const API_URL = '/staff';
const DISABLE_API = process.env.REACT_APP_DISABLE_API === 'true';
const STORAGE_KEY = 'hms_staff_members_v1';

// Staff roles with details
export const STAFF_ROLES = {
  DOCTOR: { label: 'Doctor', icon: '👨‍⚕️', color: '#2563eb' },
  NURSE: { label: 'Nurse', icon: '👩‍⚕️', color: '#059669' },
  RECEPTIONIST: { label: 'Receptionist', icon: '👩‍💼', color: '#f59e0b' },
  ADMIN: { label: 'Admin', icon: '👨‍💻', color: '#6366f1' },
  ACCOUNTANT: { label: 'Accountant', icon: '📊', color: '#8b5cf6' },
  PHARMACIST: { label: 'Pharmacist', icon: '💊', color: '#ec4899' },
  LAB_TECHNICIAN: { label: 'Lab Technician', icon: '🧪', color: '#14b8a6' },
};

// Sample staff data
const SAMPLE_STAFF = [
  {
    id: 'STAFF-001',
    name: 'Dr. Rajesh Kumar',
    role: 'DOCTOR',
    email: 'rajesh.kumar@hospital.com',
    phone: '+91-9876543210',
    department: 'Cardiology',
    specialization: 'Cardiac Surgery',
    joinDate: '2020-01-15',
    license: 'MCI-12345',
    experience: 15,
    status: 'active',
  },
  {
    id: 'STAFF-002',
    name: 'Priya Singh',
    role: 'NURSE',
    email: 'priya.singh@hospital.com',
    phone: '+91-9876543211',
    department: 'ICU',
    qualification: 'B.Sc Nursing',
    joinDate: '2021-03-20',
    license: 'NMC-67890',
    experience: 8,
    status: 'active',
  },
  {
    id: 'STAFF-003',
    name: 'Anita Sharma',
    role: 'NURSE',
    email: 'anita.sharma@hospital.com',
    phone: '+91-9876543212',
    department: 'Ward',
    qualification: 'B.Sc Nursing',
    joinDate: '2021-06-10',
    license: 'NMC-67891',
    experience: 7,
    status: 'active',
  },
  {
    id: 'STAFF-004',
    name: 'Neha Patel',
    role: 'RECEPTIONIST',
    email: 'neha.patel@hospital.com',
    phone: '+91-9876543213',
    department: 'Front Desk',
    qualification: '+2',
    joinDate: '2022-01-05',
    experience: 3,
    status: 'active',
  },
  {
    id: 'STAFF-005',
    name: 'Rohan Verma',
    role: 'ACCOUNTANT',
    email: 'rohan.verma@hospital.com',
    phone: '+91-9876543214',
    department: 'Finance',
    qualification: 'B.Com',
    joinDate: '2020-11-20',
    license: 'CA-54321',
    experience: 10,
    status: 'active',
  },
  {
    id: 'STAFF-006',
    name: 'Amit Kumar',
    role: 'ADMIN',
    email: 'amit.kumar@hospital.com',
    phone: '+91-9876543215',
    department: 'Administration',
    qualification: 'MBA',
    joinDate: '2019-06-01',
    experience: 12,
    status: 'active',
  },
];

const loadLocal = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : SAMPLE_STAFF;
  } catch (e) {
    return SAMPLE_STAFF;
  }
};

const saveLocal = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const staffService = {
  // Get all staff members
  getAllStaff: async () => {
    if (DISABLE_API) {
      return loadLocal();
    }
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      return loadLocal();
    }
  },

  // Get staff by role
  getStaffByRole: async (role) => {
    const staff = await staffService.getAllStaff();
    return staff.filter(s => s.role === role);
  },

  // Get all nurses
  getNurses: async () => {
    return staffService.getStaffByRole('NURSE');
  },

  // Get all doctors
  getDoctors: async () => {
    return staffService.getStaffByRole('DOCTOR');
  },

  // Get all receptionists
  getReceptionists: async () => {
    return staffService.getStaffByRole('RECEPTIONIST');
  },

  // Get all admin staff
  getAdmins: async () => {
    return staffService.getStaffByRole('ADMIN');
  },

  // Get all accountants
  getAccountants: async () => {
    return staffService.getStaffByRole('ACCOUNTANT');
  },

  // Get staff by department
  getStaffByDepartment: async (department) => {
    const staff = await staffService.getAllStaff();
    return staff.filter(s => s.department === department);
  },

  // Get active staff
  getActiveStaff: async () => {
    const staff = await staffService.getAllStaff();
    return staff.filter(s => s.status === 'active');
  },

  // Add new staff member
  addStaffMember: (staffData) => {
    if (DISABLE_API) {
      const staff = loadLocal();
      const newStaff = {
        id: `STAFF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        ...staffData,
      };
      const updated = [newStaff, ...staff];
      saveLocal(updated);
      return newStaff;
    }
    return staffData;
  },

  // Update staff member
  updateStaffMember: (id, staffData) => {
    if (DISABLE_API) {
      const staff = loadLocal();
      const updated = staff.map(s => (s.id === id ? { ...s, ...staffData } : s));
      saveLocal(updated);
      return updated.find(s => s.id === id);
    }
    return staffData;
  },

  // Delete staff member
  deleteStaffMember: (id) => {
    if (DISABLE_API) {
      const staff = loadLocal();
      const updated = staff.filter(s => s.id !== id);
      saveLocal(updated);
      return true;
    }
    return false;
  },

  // Get staff roles
  getStaffRoles: () => STAFF_ROLES,

  // Get departments
  getDepartments: async () => {
    const staff = await staffService.getAllStaff();
    const departments = new Set(staff.map(s => s.department).filter(Boolean));
    return Array.from(departments);
  },
};

// Legacy function exports for backwards compatibility
export const getStaffMembers = () => staffService.getAllStaff();
export const getStaffList = () => staffService.getAllStaff();
export const fetchStaff = () => staffService.getAllStaff();
export const getStaff = () => staffService.getAllStaff();
export const addStaff = (data) => staffService.addStaffMember(data);
export const addStaffMember = (data) => staffService.addStaffMember(data);
export const updateStaff = (id, data) => staffService.updateStaffMember(id, data);
export const updateStaffMember = (id, data) => staffService.updateStaffMember(id, data);
export const deleteStaffMember = (id) => staffService.deleteStaffMember(id);
export const deleteStaff = (id) => staffService.deleteStaffMember(id);

export default staffService;