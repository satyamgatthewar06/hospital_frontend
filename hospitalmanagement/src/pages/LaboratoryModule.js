import React, { useState, useContext, useMemo, useEffect } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/LaboratoryModule.css';
import ThemeToggle from '../components/ThemeToggle';
import BillingActions from '../components/BillingActions';

const LaboratoryModule = () => {
  const { labTests, bills, hospitalData } = useContext(HospitalContext);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    testType: 'Blood Test',
    testName: '',
    collectionDate: new Date().toISOString().split('T')[0],
    reportDate: '',
    status: 'Pending',
    results: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedReport, setExpandedReport] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  const contextData = labTests || [];
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    if (contextData?.length) setLocalData(contextData);
  }, [contextData]);

  const data = localData || [];

  const tests = data || [];
  const testTypes = ['Blood Test', 'Urine Test', 'X-Ray', 'Ultrasound', 'CT Scan', 'ECG', 'Full Body Checkup'];
  const bloodTestSubTypes = ['Complete Blood Count', 'Blood Sugar', 'Thyroid Profile', 'Lipid Profile', 'Liver Function', 'Kidney Function'];
  const urineTestSubTypes = ['Routine', 'Culture & Sensitivity', 'Pregnancy', 'Microalbumin'];

  const stats = useMemo(() => ({
    total: tests.length,
    pending: tests.filter(t => t.status === 'Pending').length,
    completed: tests.filter(t => t.status === 'Completed').length,
    critical: tests.filter(t => t.status === 'Critical').length
  }), [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'All' || test.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tests, searchTerm, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTest = {
      id: Date.now(),
      ...formData,
      reportDate: formData.reportDate || new Date().toISOString().split('T')[0]
    };
    
    setLocalData([...localData, newTest]);

    setFormData({
      patientName: '',
      patientId: '',
      testType: 'Blood Test',
      testName: '',
      collectionDate: new Date().toISOString().split('T')[0],
      reportDate: '',
      status: 'Pending',
      results: ''
    });
    setActiveTab('list');
  };

  const handleDeleteTest = (id) => {
    setLocalData(localData.filter(test => test.id !== id));
  };

  const handleUpdateStatus = (id, newStatus) => {
    setLocalData(localData.map(test =>
      test.id === id ? { ...test, status: newStatus, reportDate: new Date().toISOString().split('T')[0] } : test
    ));
  };

  const generateReport = (test) => {
    const reportContent = `
      <html>
        <head>
          <title>Lab Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; }
            .section { margin: 15px 0; }
            .label { font-weight: bold; }
            .value { margin-left: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>LABORATORY TEST REPORT</h2>
            <p>Report ID: LAB-${test.id}</p>
          </div>
          
          <div class="section">
            <p class="label">Patient Information</p>
            <div class="value">
              <p>Name: ${test.patientName}</p>
              <p>Patient ID: ${test.patientId}</p>
            </div>
          </div>

          <div class="section">
            <p class="label">Test Information</p>
            <div class="value">
              <p>Test Type: ${test.testType}</p>
              <p>Test Name: ${test.testName}</p>
              <p>Collection Date: ${test.collectionDate}</p>
              <p>Report Date: ${test.reportDate}</p>
            </div>
          </div>

          <div class="section">
            <p class="label">Test Results</p>
            <div class="value">
              <pre>${test.results || 'Results pending...'}</pre>
            </div>
          </div>

          <div class="section">
            <p class="label">Status: <span style="color: ${test.status === 'Critical' ? 'red' : test.status === 'Completed' ? 'green' : 'orange'}">${test.status}</span></p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="laboratory-module">
      <h1>🔬 Laboratory Module</h1>
      <ThemeToggle />

      <div className="lab-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Tests</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Critical</span>
            <span className="stat-value">{stats.critical}</span>
          </div>
        </div>
      </div>

      <div className="tabs-navigation">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          📋 Tests List
        </button>
        <button className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
          ➕ New Test
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="form-section">
          <h2>Add New Laboratory Test</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  required
                  placeholder="Enter patient name"
                />
              </div>
              <div className="form-group">
                <label>Patient ID</label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  required
                  placeholder="Enter patient ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Test Type</label>
                <select value={formData.testType} onChange={(e) => setFormData({...formData, testType: e.target.value})}>
                  {testTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Test Name</label>
                <select value={formData.testName} onChange={(e) => setFormData({...formData, testName: e.target.value})} required>
                  <option value="">Select test...</option>
                  {(formData.testType === 'Blood Test' ? bloodTestSubTypes : formData.testType === 'Urine Test' ? urineTestSubTypes : ['Standard']).map(name => 
                    <option key={name} value={name}>{name}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Collection Date</label>
                <input
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) => setFormData({...formData, collectionDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Report Date</label>
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => setFormData({...formData, reportDate: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Results</label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData({...formData, results: e.target.value})}
                placeholder="Enter test results (optional)"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Submit Test</button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="list-section">
          <div className="list-header">
            <h2>Laboratory Tests</h2>
            <div style={{display: 'flex', gap: '1rem'}}>
              <input
                type="text"
                placeholder="Search tests..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {filteredTests.length === 0 ? (
            <div className="no-data">No tests found</div>
          ) : (
            <div className="tests-grid">
              {filteredTests.map((test, idx) => (
                <div key={idx} className="test-card">
                  <div className="test-header">
                    <h4>{test.testType}</h4>
                    <span className={`status ${test.status.toLowerCase()}`}>{test.status}</span>
                  </div>
                  <div className="test-details">
                    <p><strong>Patient:</strong> {test.patientName}</p>
                    <p><strong>Test:</strong> {test.testName}</p>
                    <p><strong>Collection:</strong> {test.collectionDate}</p>
                    <p><strong>Report Date:</strong> {test.reportDate}</p>
                  </div>
                  <div className="test-actions">
                    <button className="btn btn-small btn-primary" onClick={() => generateReport(test)}>📄 Print Report</button>
                    <select 
                      value={test.status} 
                      onChange={(e) => handleUpdateStatus(test.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Critical">Critical</option>
                    </select>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteTest(test.id)}>🗑️ Delete</button>
                  </div>
                  {test.results && (
                    <div className="test-expanded">
                      <p><strong>Results:</strong></p>
                      <pre>{test.results}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BillingActions bill={selectedBill} bills={bills} allData={hospitalData} />
    </div>
  );
};

export default LaboratoryModule;
REACT_APP_RAZORPAY_KEY=your_key_here
