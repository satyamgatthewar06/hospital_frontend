import React, { useEffect, useState } from 'react';
import { LaboratoryService } from '../../services/laboratoryService';
import { fetchPatients } from '../../services/patientService';
import { addAssignment, fetchAssignments } from '../../services/labAssignmentService';

const AssignTests = () => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedTests, setSelectedTests] = useState(new Set());
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [message, setMessage] = useState('');
  const [showBloodOnly, setShowBloodOnly] = useState(false);

  useEffect(() => {
    setTests(LaboratoryService.getAllTests());
    const load = async () => {
      const p = await fetchPatients();
      // Fallback sample patients when API/local storage has none
      const samplePatients = [
        {
          id: 'PAT-001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-05-15',
          phone: '9876543210',
        },
        {
          id: 'PAT-002',
          firstName: 'Sarah',
          lastName: 'Smith',
          dateOfBirth: '1990-08-22',
          phone: '9876543212',
        },
      ];

      setPatients((p && p.length > 0) ? p : samplePatients);
    };
    load();
  }, []);

  const toggleTest = (id) => {
    const s = new Set(selectedTests);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelectedTests(s);
  };

  const displayedTests = tests.filter((t) => {
    if (!showBloodOnly) return true;
    return String(t.format).toLowerCase().includes('blood');
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!patientId) return alert('Select a patient');
    if (selectedTests.size === 0) return alert('Select at least one test');
    const patient = patients.find((p) => p.id === patientId) || { firstName: '', lastName: '' };
    const testsSelected = tests.filter((t) => selectedTests.has(t.id));
    const assignment = {
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`.trim() || patientId,
      tests: testsSelected,
      status: 'Assigned',
    };
    await addAssignment(assignment);
    setSelectedTests(new Set());
    setMessage('Tests assigned successfully');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="assign-tests">
      <h3>Assign Tests to Patient</h3>
      <form onSubmit={submit} className="assign-form">
        <div>
          <label>Patient</label>
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Select patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
            ))}
          </select>
        </div>

        <div>
          <label>Available Tests</label>

          <div style={{ margin: '6px 0' }}>
            <label style={{ fontSize: 14 }}>
              <input type="checkbox" checked={showBloodOnly} onChange={(e) => setShowBloodOnly(e.target.checked)} />{' '}
              Show blood tests only
            </label>
          </div>

          <div className="tests-grid">
            {displayedTests.map((t) => (
              <label key={t.id} className="test-item">
                <input type="checkbox" checked={selectedTests.has(t.id)} onChange={() => toggleTest(t.id)} />
                <span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{t.format}</div>
                    </div>
                    <div className="test-price">₹{t.price}</div>
                  </div>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Assign Selected Tests</button>
        </div>
      </form>

      {message && <div className="success">{message}</div>}
    </div>
  );
};

export default AssignTests;
