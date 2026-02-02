import React, { useState, useContext } from 'react';
import { HospitalContext } from '../../context/HospitalContext';
import { LaboratoryService } from '../../services/laboratoryService';
import './UploadResults.css';

function UploadResults() {
  const { testAssignments, updateTestResults } = useContext(HospitalContext);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [results, setResults] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const assignment = selectedAssignment 
    ? testAssignments?.find(ta => ta.id === selectedAssignment)
    : null;

  const handleResultChange = (testId, value) => {
    setResults(prev => ({
      ...prev,
      [testId]: value
    }));
  };

  const handleSubmitResults = () => {
    if (!selectedAssignment) {
      setMessage({ type: 'error', text: 'Please select a test assignment' });
      return;
    }

    if (!assignment) {
      setMessage({ type: 'error', text: 'Assignment not found' });
      return;
    }

    // Validate all results are filled
    const missingResults = assignment.tests.filter(test => !results[test.id]);
    if (missingResults.length > 0) {
      setMessage({ type: 'error', text: 'Please fill in all test results' });
      return;
    }

    // Validate each result
    for (const test of assignment.tests) {
      const validation = LaboratoryService.validateResults(test.id, results[test.id]);
      if (!validation.valid) {
        setMessage({ type: 'error', text: `${test.name}: ${validation.message}` });
        return;
      }
    }

    const formattedResults = assignment.tests.map(test => ({
      testId: test.id,
      testName: test.name,
      resultValue: results[test.id],
      status: 'Completed',
      submittedDate: new Date().toLocaleDateString()
    }));

    if (updateTestResults) {
      updateTestResults(selectedAssignment, formattedResults);
    }

    setMessage({ 
      type: 'success', 
      text: 'Test results submitted successfully!' 
    });

    // Reset form
    setResults({});
    setSelectedAssignment('');
    setShowForm(false);

    setTimeout(() => setMessage(''), 3000);
  };

  const pendingAssignments = testAssignments?.filter(ta => ta.status === 'Assigned') || [];

  return (
    <div className="upload-results-container">
      <h3>📊 Upload Test Results</h3>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label>Select Test Assignment:</label>
        <select 
          value={selectedAssignment}
          onChange={(e) => {
            setSelectedAssignment(e.target.value);
            setShowForm(!!e.target.value);
            setResults({});
          }}
          className="form-select"
        >
          <option value="">-- Choose an assignment --</option>
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map(assignment => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.patientName} - {assignment.tests.length} test(s) 
                ({assignment.assignedDate})
              </option>
            ))
          ) : (
            <option disabled>No pending assignments</option>
          )}
        </select>
      </div>

      {showForm && assignment && (
        <div className="results-form">
          <div className="assignment-info">
            <p><strong>Patient:</strong> {assignment.patientName}</p>
            <p><strong>Assignment ID:</strong> {assignment.id}</p>
            <p><strong>Tests to Complete:</strong> {assignment.tests.length}</p>
          </div>

          <div className="results-inputs">
            {assignment.tests.map(test => (
              <div key={test.id} className="result-input-group">
                <label htmlFor={`result-${test.id}`}>
                  {test.name}
                  <span className="format-badge">{test.format}</span>
                </label>
                <input
                  id={`result-${test.id}`}
                  type="text"
                  placeholder={`Enter result for ${test.name}`}
                  value={results[test.id] || ''}
                  onChange={(e) => handleResultChange(test.id, e.target.value)}
                  className="form-input"
                />
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button 
              onClick={handleSubmitResults}
              className="btn-submit-results"
              disabled={Object.keys(results).length < assignment.tests.length}
            >
              ✓ Submit Results
            </button>
            <button 
              onClick={() => {
                setShowForm(false);
                setResults({});
              }}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!assignment && selectedAssignment && (
        <div className="message error">
          Assignment not found. Please select again.
        </div>
      )}
    </div>
  );
}

export default UploadResults;
