import React, { createContext, useState } from 'react';

// Step 1: Create the context
export const HospitalContext = createContext();

// Step 2: Create the Provider component
export function HospitalProvider({ children }) {
  // Step 3: Define state variables for different hospital data
  const [patients, setPatients] = useState([]);

  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. P V Gadewar',
      specialty: 'Gynecology',
      contact: '02462247499',
      experience: '18 years',
      availability: 'Mon-Sat 09:00-17:00',
      image: 'https://i.pravatar.cc/150?img=12',
      mmcReg: 'MMC/GA/12345',
      qualifications: ['MBBS', 'MS (Obstetrics & Gynaecology)'],
      registrationCertificate: 'https://example.com/certs/dr-pv-gadewar-cert.pdf'
    },
    {
      id: 2,
      name: 'Dr. P G Gadewar',
      specialty: 'Orthopedics',
      contact: '02462247498',
      experience: '12 years',
      availability: 'Tue-Fri 10:00-16:00',
      image: 'https://i.pravatar.cc/150?img=5',
      mmcReg: 'MMC/OR/67890',
      qualifications: ['MBBS', 'D.Ortho'],
      registrationCertificate: 'https://example.com/certs/dr-pg-gadewar-cert.pdf'
    },
  ]);

  const [staff, setStaff] = useState([]);
  const [bills, setBills] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [testAssignments, setTestAssignments] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', name: 'Administrator', role: 'admin', password: 'admin' },
    { id: 2, username: 'doctor1', name: 'Dr. Example', role: 'doctor', password: 'doctor' },
    { id: 3, username: 'account1', name: 'Accountant', role: 'accountant', password: 'account' }
  ]);
  const [currentUser, setCurrentUser] = useState(users[0] || null);

  const addPatient = (patient) => setPatients(prev => [...prev, patient]);
  const addAppointment = (appointment) => setAppointments(prev => [...prev, appointment]);
  const addBill = (bill) => setBills(prev => [...prev, bill]);
  const updateBillPayment = (billId, updates) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, ...updates } : b));
  };
  const addStaff = (staffMember) => setStaff(prev => [...prev, staffMember]);

  // New: addDoctor
  const addDoctor = (doctor) => {
    setDoctors(prev => [...prev, { id: Date.now(), ...doctor }]);
  };

  // Laboratory functions
  const addTestAssignment = (assignment) => {
    setTestAssignments(prev => [...prev, assignment]);
  };

  const updateTestResults = (assignmentId, results) => {
    setTestAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, results, status: 'Completed' }
        : assignment
    ));
  };

  // User management / simple auth (in-memory)
  const addUser = (user) => {
    setUsers(prev => [...prev, { id: Date.now(), ...user }]);
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) setCurrentUser(user);
    return user || null;
  };

  const logout = () => setCurrentUser(null);

  // Step 4: Provide all data to the app
  return (
    <HospitalContext.Provider value={{ 
      patients, 
      addPatient, 
      appointments,
      setAppointments,
      addAppointment,
      bills,
      addBill,
      updateBillPayment,
      staff,
      addStaff,
      doctors,
      addDoctor,
      labTests,
      testAssignments,
      addTestAssignment,
      updateTestResults,
      // Users & auth
      users,
      addUser,
      updateUser,
      currentUser,
      login,
      logout
    }}>
      {children}
    </HospitalContext.Provider>
  );
}