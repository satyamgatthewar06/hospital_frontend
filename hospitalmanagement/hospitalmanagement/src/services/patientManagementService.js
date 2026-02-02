// Patient Management Service - Handles all patient-related operations

// Generate unique patient ID
export const generatePatientId = () => {
  return `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Generate unique visit ID
export const generateVisitId = () => {
  return `VIS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Validate patient form data
export const validatePatientForm = (formData) => {
  const errors = {};

  if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
  if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!formData.gender) errors.gender = 'Gender is required';
  if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
  if (!formData.email?.trim()) errors.email = 'Email is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';

  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone validation (basic)
  if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone must be 10 digits';
  }

  return errors;
};

// Validate OPD registration form
export const validateOPDRegistration = (formData) => {
  const errors = {};

  if (!formData.department) errors.department = 'Department is required';
  if (!formData.doctor) errors.doctor = 'Doctor is required';
  if (!formData.visitReason?.trim()) errors.visitReason = 'Visit reason is required';
  if (!formData.symptoms?.trim()) errors.symptoms = 'Symptoms is required';

  return errors;
};

// Validate IPD registration form
export const validateIPDRegistration = (formData) => {
  const errors = {};

  if (!formData.department) errors.department = 'Department is required';
  if (!formData.doctor) errors.doctor = 'Doctor is required';
  if (!formData.admissionReason?.trim()) errors.admissionReason = 'Admission reason is required';
  if (!formData.ward) errors.ward = 'Ward is required';
  if (!formData.bedNumber?.trim()) errors.bedNumber = 'Bed number is required';

  return errors;
};

// Validate discharge summary form
export const validateDischargeSummary = (formData) => {
  const errors = {};

  if (!formData.diagnosis?.trim()) errors.diagnosis = 'Diagnosis is required';
  if (!formData.treatment?.trim()) errors.treatment = 'Treatment is required';
  if (!formData.medicines?.trim()) errors.medicines = 'Medicines is required';
  if (!formData.followUpDate) errors.followUpDate = 'Follow-up date is required';
  if (!formData.restrictions?.trim()) errors.restrictions = 'Restrictions is required';

  return errors;
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Format date to readable format
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format time to readable format
export const formatTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get patient summary
export const getPatientSummary = (patient) => {
  return {
    id: patient.id,
    name: `${patient.firstName} ${patient.lastName}`,
    age: calculateAge(patient.dateOfBirth),
    gender: patient.gender,
    phone: patient.phone,
    email: patient.email,
    registrationDate: formatDate(patient.registrationDate),
  };
};

// Mock departments list
export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Surgery',
  'Gynecology',
  'ENT',
  'Dermatology',
  'Psychiatry',
];

// Mock doctors list
export const DOCTORS = [
  { id: 1, name: 'Dr. Rajesh Kumar', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Priya Singh', specialty: 'Neurology' },
  { id: 3, name: 'Dr. Amit Sharma', specialty: 'Orthopedics' },
  { id: 4, name: 'Dr. Ananya Patel', specialty: 'Pediatrics' },
  { id: 5, name: 'Dr. Vikram Desai', specialty: 'Surgery' },
  { id: 6, name: 'Dr. Shreya Gupta', specialty: 'Gynecology' },
  { id: 7, name: 'Dr. Arjun Nair', specialty: 'ENT' },
  { id: 8, name: 'Dr. Neha Verma', specialty: 'Dermatology' },
];

// Mock wards list
export const WARDS = ['Ward A', 'Ward B', 'Ward C', 'Ward D', 'ICU', 'HDU'];

// Get doctors by department
export const getDoctorsByDepartment = (department) => {
  return DOCTORS.filter((doctor) => doctor.specialty === department);
};
