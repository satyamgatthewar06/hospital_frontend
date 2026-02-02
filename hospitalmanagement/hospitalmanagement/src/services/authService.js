// Authentication Service
const DISABLE_API = process.env.REACT_APP_DISABLE_API === 'true';
const AUTH_STORAGE_KEY = 'hms_auth_user_v1';

// Sample users with different roles
const SAMPLE_USERS = [
  {
    id: 'USER-001',
    email: 'admin@hospital.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Admin User',
    role: 'ADMIN',
    department: 'Administration',
  },
  {
    id: 'USER-002',
    email: 'doctor@hospital.com',
    password: 'doc123',
    name: 'Dr. Rajesh Kumar',
    role: 'DOCTOR',
    department: 'Cardiology',
  },
  {
    id: 'USER-003',
    email: 'receptionist@hospital.com',
    password: 'rec123',
    name: 'Neha Patel',
    role: 'RECEPTIONIST',
    department: 'Front Desk',
  },
  {
    id: 'USER-004',
    email: 'accountant@hospital.com',
    password: 'acc123',
    name: 'Rohan Verma',
    role: 'ACCOUNTANT',
    department: 'Finance',
  },
  {
    id: 'USER-005',
    email: 'nurse@hospital.com',
    password: 'nurse123',
    name: 'Priya Singh',
    role: 'NURSE',
    department: 'ICU',
  },
];

const loadUsersLocal = () => {
  try {
    const data = localStorage.getItem('hms_users_v1');
    return data ? JSON.parse(data) : SAMPLE_USERS;
  } catch (e) {
    return SAMPLE_USERS;
  }
};

const saveUsersLocal = (data) => {
  localStorage.setItem('hms_users_v1', JSON.stringify(data));
};

// Get current logged-in user
const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// Save current user
const saveCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const authService = {
  // Login user
  login: async (email, password) => {
    if (DISABLE_API) {
      const users = loadUsersLocal();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const loggedInUser = { ...user, loginTime: new Date().toISOString() };
        delete loggedInUser.password; // Don't store password
        saveCurrentUser(loggedInUser);
        return { success: true, user: loggedInUser };
      }
      return { success: false, error: 'Invalid email or password' };
    }
    return { success: false, error: 'API disabled' };
  },

  // Logout user
  logout: () => {
    saveCurrentUser(null);
    return { success: true };
  },

  // Get current user
  getCurrentUser: () => {
    return getCurrentUser();
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return getCurrentUser() !== null;
  },

  // Check if user has role
  hasRole: (requiredRole) => {
    const user = getCurrentUser();
    return user && user.role === requiredRole;
  },

  // Check if user has any of the roles
  hasAnyRole: (roles) => {
    const user = getCurrentUser();
    return user && roles.includes(user.role);
  },

  // Register new user (admin only)
  registerUser: (userData, currentUserRole) => {
    if (currentUserRole !== 'ADMIN') {
      return { success: false, error: 'Only admins can register users' };
    }

    const users = loadUsersLocal();
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = {
      id: `USER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...userData,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsersLocal(users);
    return { success: true, user: newUser };
  },

  // Update user (admin only)
  updateUser: (userId, userData, currentUserRole) => {
    if (currentUserRole !== 'ADMIN') {
      return { success: false, error: 'Only admins can update users' };
    }

    const users = loadUsersLocal();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex] = { ...users[userIndex], ...userData };
    saveUsersLocal(users);
    return { success: true, user: users[userIndex] };
  },

  // Delete user (admin only)
  deleteUser: (userId, currentUserRole) => {
    if (currentUserRole !== 'ADMIN') {
      return { success: false, error: 'Only admins can delete users' };
    }

    const users = loadUsersLocal();
    const filtered = users.filter(u => u.id !== userId);
    saveUsersLocal(filtered);
    return { success: true };
  },

  // Get all users (admin only)
  getAllUsers: (currentUserRole) => {
    if (currentUserRole !== 'ADMIN') {
      return [];
    }
    return loadUsersLocal();
  },

  // Get users by role (admin only)
  getUsersByRole: (role, currentUserRole) => {
    if (currentUserRole !== 'ADMIN') {
      return [];
    }
    const users = loadUsersLocal();
    return users.filter(u => u.role === role);
  },
};

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  ACCOUNTANT: 'ACCOUNTANT',
  PHARMACIST: 'PHARMACIST',
  LAB_TECHNICIAN: 'LAB_TECHNICIAN',
};

export const ROLE_PERMISSIONS = {
  ADMIN: [
    'view_staff',
    'add_staff',
    'edit_staff',
    'delete_staff',
    'view_users',
    'add_users',
    'edit_users',
    'delete_users',
    'view_reports',
    'view_billing',
    'manage_appointments',
  ],
  DOCTOR: [
    'view_appointments',
    'view_patients',
    'manage_own_schedule',
  ],
  RECEPTIONIST: [
    'view_appointments',
    'view_doctors',
    'count_appointments',
    'schedule_appointments',
    'view_patients',
  ],
  ACCOUNTANT: [
    'view_billing',
    'manage_billing',
    'view_reports',
  ],
  NURSE: [
    'view_patients',
    'view_wards',
    'manage_wards',
  ],
  PHARMACIST: [
    'view_medicines',
    'manage_inventory',
  ],
  LAB_TECHNICIAN: [
    'view_tests',
    'manage_tests',
  ],
};

export default authService;
