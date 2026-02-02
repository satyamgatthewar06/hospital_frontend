import React, { createContext, useState } from 'react';

// Create the context
export const HospitalContext = createContext();

// Create the Provider component
export function HospitalProvider({ children }) {
  // Define state variables for different hospital data
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
    },
    {
      id: 2,
      name: 'Dr. P G Gadewar',
      specialty: 'Orthopedics',
      contact: '02462247498',
      experience: '12 years',
      availability: 'Tue-Fri 10:00-16:00',
      image: 'https://i.pravatar.cc/150?img=5',
    },
  ]);

  const [staff, setStaff] = useState([]);
  const [bills, setBills] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const addPatient = (patient) => setPatients(prev => [...prev, patient]);
  const addAppointment = (appointment) => setAppointments(prev => [...prev, appointment]);
  const addBill = (bill) => setBills(prev => [...prev, bill]);
  const updateBillPayment = (billId, updates) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, ...updates } : b));
  };
  const addStaff = (staffMember) => setStaff(prev => [...prev, staffMember]);

  // Provide all data to the app
  return (
    <HospitalContext.Provider value={{ 
      patients, 
      addPatient, 
      appointments, 
      addAppointment,
      bills,
      addBill,
      updateBillPayment,
      staff,
      addStaff,
      doctors,
    }}>
      {children}
    </HospitalContext.Provider>
  );
}
