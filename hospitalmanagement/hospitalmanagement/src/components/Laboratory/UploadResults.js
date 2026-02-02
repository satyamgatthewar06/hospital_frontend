import React, { useEffect, useState } from 'react';
import { fetchAssignments, updateAssignment } from '../../services/labAssignmentService';
import { LaboratoryService } from '../../services/laboratoryService';

const UploadResults = () => {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [inputs, setInputs] = useState({});
  const [message, setMessage] = useState('');

  const load = async () => {
    const a = await fetchAssignments();
    setAssignments(a || []);
  };

  useEffect(() => { load(); }, []);

  const pick = (id) => {
    const a = assignments.find((it) => it.id === id);
    setSelected(a);
    const initial = {};
    (a.tests || []).forEach((t) => { initial[t.id] = ''; });
    setInputs(initial);
  };

  const handleChange = (testId, value) => {
    setInputs((s) => ({ ...s, [testId]: value }));
  };

  const submitResults = async () => {
    if (!selected) return;
    const results = [];
    for (const t of selected.tests) {
      const val = (inputs[t.id] || '').toString().trim();
      const valid = LaboratoryService.validateResults(t.id, val);
      if (!valid.valid) return alert(`Test ${t.name}: ${valid.message}`);
      results.push({ testId: t.id, testName: t.name, resultValue: val, status: 'Completed' });
    }
    await updateAssignment(selected.id, { results, status: 'Completed', completedAt: new Date().toISOString() });
    setMessage('Results uploaded');
    setSelected(null);
    setInputs({});
    setTimeout(() => setMessage(''), 2500);
    load();
  };

  return (
    <div className="upload-results">
      <h3>Upload Lab Results</h3>
      <div className="upload-grid">
        <div className="assign-list">
          <h4>Assigned Tests</h4>
          <ul>
            {assignments.filter(a => a.status === 'Assigned').length === 0 && <li>No assigned tests</li>}
            {assignments.filter(a => a.status === 'Assigned').map((a) => (
              <li key={a.id}>
                <button onClick={() => pick(a.id)}>{a.patientName || a.patientId} — {a.tests.length} tests</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="result-entry">
          {selected ? (
            <div>
              <h4>Enter Results for {selected.patientName || selected.patientId}</h4>
              {selected.tests.map((t) => (
                <div key={t.id} className="result-row">
                  <label>{t.name} ({t.format})</label>
                  <input value={inputs[t.id] || ''} onChange={(e) => handleChange(t.id, e.target.value)} />
                </div>
              ))}
              <div className="form-actions">
                <button onClick={submitResults}>Submit Results</button>
                <button onClick={() => { setSelected(null); setInputs({}); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div><p>Select an assignment to upload results.</p></div>
          )}
        </div>
      </div>
      {message && <div className="success">{message}</div>}
    </div>
  );
};

export default UploadResults;
