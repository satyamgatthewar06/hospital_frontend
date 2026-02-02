import React, { useState, useContext } from 'react';
import { HospitalContext } from '../../context/HospitalContext';
import { LaboratoryService } from '../../services/laboratoryService';
import './AssignTests.css';

function AssignTests() {
  const { patients, addTestAssignment } = useContext(HospitalContext);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const allTests = LaboratoryService.getAllTests();

  const handleTestToggle = (testId) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };

  const handleAssignTests = () => {
    if (!selectedPatient) {
      setMessage({ type: 'error', text: 'Please select a patient' });
      return;
    }

    if (selectedTests.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one test' });
      return;
    }

    const patient = patients.find(p => p.id === parseInt(selectedPatient));
    if (!patient) {
      setMessage({ type: 'error', text: 'Patient not found' });
      return;
    }

    const assignment = {
      id: `TA-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name || patient.patientName,
      tests: selectedTests.map(testId => {
        const test = allTests.find(t => t.id === testId);
        return {
          id: test.id,
          name: test.name,
          format: test.format,
          price: test.price
        };
      }),
      notes: notes,
      status: 'Assigned',
      assignedDate: new Date().toLocaleDateString(),
      results: []
    };

    if (addTestAssignment) {
      addTestAssignment(assignment);
    }

    setMessage({ 
      type: 'success', 
      text: `Tests assigned successfully to ${patient.name || patient.patientName}` 
    });
    
    // Reset form
    setSelectedPatient('');
    setSelectedTests([]);
    setNotes('');

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="assign-tests-container">
      <h3>📋 Assign Tests to Patient</h3>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label>Select Patient:</label>
        <select 
          value={selectedPatient} 
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="form-select"
        >
          <option value="">-- Choose a patient --</option>
          {patients && patients.length > 0 ? (
            patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name || patient.patientName} (ID: {patient.id})
              </option>
            ))
          ) : (
            <option disabled>No patients found</option>
          )}
        </select>
      </div>

      <div className="form-group">
        <label>Select Tests:</label>
        <div className="tests-grid">
          {allTests.map(test => (
            <div key={test.id} className="test-checkbox">
              <input
                type="checkbox"
                id={`test-${test.id}`}
                checked={selectedTests.includes(test.id)}
                onChange={() => handleTestToggle(test.id)}
              />
              <label htmlFor={`test-${test.id}`}>
                <span className="test-name">{test.name}</span>
                <span className="test-price">₹{test.price}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Notes (Optional):</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any special instructions or notes..."
          rows="3"
          className="form-textarea"
        ></textarea>
      </div>

      <div className="selected-summary">
        <p><strong>Selected Tests:</strong> {selectedTests.length}</p>
        <p><strong>Total Cost:</strong> ₹{
          selectedTests.reduce((sum, testId) => {
            const test = allTests.find(t => t.id === testId);
            return sum + (test ? test.price : 0);
          }, 0)
        }</p>
      </div>

      <button 
        onClick={handleAssignTests}
        className="btn-assign"
        disabled={!selectedPatient || selectedTests.length === 0}
      >
        ✓ Assign Tests
      </button>
    </div>
  );
}

export default AssignTests;
