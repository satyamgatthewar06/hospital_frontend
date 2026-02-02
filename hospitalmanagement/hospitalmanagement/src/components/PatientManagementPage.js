import React, { useState } from 'react';
import '../styles/PatientManagement.css';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import OPDRegistration from './OPDRegistration';
import IPDRegistration from './IPDRegistration';
import DischargeSummary from './DischargeSummary';
import VisitHistory from './VisitHistory';

const PatientManagementPage = () => {
  const [patients, setPatients] = useState([
    {
      id: 'PAT-001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      gender: 'Male',
      phone: '9876543210',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      bloodGroup: 'O+',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '9876543211',
      medicalHistory: 'Diabetes, Hypertension',
      allergies: 'Penicillin',
      registrationDate: new Date().toISOString(),
    },
    {
      id: 'PAT-002',
      firstName: 'Sarah',
      lastName: 'Smith',
      dateOfBirth: '1990-08-22',
      gender: 'Female',
      phone: '9876543212',
      email: 'sarah@example.com',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      bloodGroup: 'A+',
      emergencyContact: 'Tom Smith',
      emergencyPhone: '9876543213',
      medicalHistory: 'Asthma',
      allergies: 'None',
      registrationDate: new Date().toISOString(),
    },
  ]);

  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // list, add, details, opd, ipd, discharge, history
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedIPDRegistration, setSelectedIPDRegistration] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Patient Management Functions
  const handleAddPatient = (formData) => {
    const newPatient = {
      ...formData,
      id: `PAT-${String(patients.length + 1).padStart(3, '0')}`,
    };
    setPatients([...patients, newPatient]);
    setActiveTab('list');
  };

  const handleUpdatePatient = (formData) => {
    setPatients(
      patients.map((p) => (p.id === editingPatient.id ? { ...p, ...formData } : p))
    );
    setEditingPatient(null);
    setSelectedPatient(null);
    setActiveTab('list');
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter((p) => p.id !== patientId));
      setSelectedPatient(null);
      setActiveTab('list');
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('details');
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setActiveTab('add');
  };

  // Visit Management Functions
  const handleRegisterOPD = (opdData) => {
    const newVisit = {
      ...opdData,
      type: 'OPD',
      date: new Date().toISOString(),
    };
    setVisits([...visits, newVisit]);
    setActiveTab('history');
  };

  const handleRegisterIPD = (ipdData) => {
    const newVisit = {
      ...ipdData,
      type: 'IPD',
      date: new Date().toISOString(),
    };
    setVisits([...visits, newVisit]);
    setSelectedIPDRegistration(newVisit);
    setActiveTab('history');
  };

  const handleDischargeSummary = (summaryData) => {
    // Update the IPD visit with discharge info
    const updatedVisits = visits.map((v) =>
      v.id === summaryData.ipdRegistrationId ? { ...v, ...summaryData, status: 'Discharged' } : v
    );
    setVisits(updatedVisits);
    setActiveTab('history');
  };

  const handleViewHistory = (patient) => {
    setSelectedPatient(patient);
    const patientVisits = visits.filter((v) => v.patientId === patient.id);
    setActiveTab('history');
  };

  // Search and Filter
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.id.includes(searchLower) ||
      patient.phone.includes(searchLower)
    );
  });

  const getPatientVisits = (patientId) => {
    return visits.filter((v) => v.patientId === patientId);
  };

  return (
    <div className="patient-management-page">
      <div className="page-header">
        <h1>Patient Management</h1>
        <p>Manage patient records, registrations, and medical history</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('list');
            setSearchTerm('');
          }}
        >
          👥 Patient List
        </button>
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('add');
            setEditingPatient(null);
          }}
        >
          ➕ Add Patient
        </button>
        {selectedPatient && (
          <>
            <button
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              📋 Patient Details
            </button>
            <button
              className={`tab-button ${activeTab === 'opd' ? 'active' : ''}`}
              onClick={() => setActiveTab('opd')}
            >
              🏥 OPD Registration
            </button>
            <button
              className={`tab-button ${activeTab === 'ipd' ? 'active' : ''}`}
              onClick={() => setActiveTab('ipd')}
            >
              🛏️ IPD Registration
            </button>
            {selectedIPDRegistration && (
              <button
                className={`tab-button ${activeTab === 'discharge' ? 'active' : ''}`}
                onClick={() => setActiveTab('discharge')}
              >
                ✓ Discharge Summary
              </button>
            )}
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📜 Visit History
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Patient List Tab */}
        {activeTab === 'list' && (
          <PatientList
            patients={filteredPatients}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onViewDetails={handleViewDetails}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onViewHistory={handleViewHistory}
            getPatientVisits={getPatientVisits}
          />
        )}

        {/* Add/Edit Patient Tab */}
        {activeTab === 'add' && (
          <div className="form-container">
            <PatientForm
              patient={editingPatient}
              onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}
              onCancel={() => {
                setActiveTab('list');
                setEditingPatient(null);
              }}
            />
          </div>
        )}

        {/* Patient Details Tab */}
        {activeTab === 'details' && selectedPatient && (
          <PatientDetails
            patient={selectedPatient}
            onEdit={() => handleEditPatient(selectedPatient)}
            onViewHistory={() => setActiveTab('history')}
            onRegisterOPD={() => setActiveTab('opd')}
            onRegisterIPD={() => setActiveTab('ipd')}
            visitCount={getPatientVisits(selectedPatient.id).length}
          />
        )}

        {/* OPD Registration Tab */}
        {activeTab === 'opd' && selectedPatient && (
          <OPDRegistration
            patients={[selectedPatient]}
            onRegister={handleRegisterOPD}
            onCancel={() => setActiveTab('details')}
          />
        )}

        {/* IPD Registration Tab */}
        {activeTab === 'ipd' && selectedPatient && (
          <IPDRegistration
            patients={[selectedPatient]}
            onRegister={(ipdData) => {
              setSelectedIPDRegistration(ipdData);
              handleRegisterIPD(ipdData);
            }}
            onCancel={() => setActiveTab('details')}
          />
        )}

        {/* Discharge Summary Tab */}
        {activeTab === 'discharge' && selectedPatient && selectedIPDRegistration && (
          <DischargeSummary
            patient={selectedPatient}
            ipdRegistration={selectedIPDRegistration}
            onSubmit={handleDischargeSummary}
            onCancel={() => setActiveTab('history')}
          />
        )}

        {/* Visit History Tab */}
        {activeTab === 'history' && selectedPatient && (
          <VisitHistory
            patient={selectedPatient}
            visits={getPatientVisits(selectedPatient.id)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientManagementPage;
