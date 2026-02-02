import React, { useContext, useState } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import AssignTests from '../components/Laboratory/AssignTests';
import UploadResults from '../components/Laboratory/UploadResults';
import PrintReports from '../components/Laboratory/PrintReports';
import '../styles/Laboratory.css';

function LaboratoryPage() {
  const { testAssignments } = useContext(HospitalContext);
  const [activeTab, setActiveTab] = useState('assign');

  const stats = {
    totalAssignments: testAssignments?.length || 0,
    pendingResults: testAssignments?.filter(ta => ta.status === 'Assigned')?.length || 0,
    completedTests: testAssignments?.filter(ta => ta.status === 'Completed')?.length || 0,
    totalTests: testAssignments?.reduce((sum, ta) => sum + (ta.tests?.length || 0), 0) || 0
  };

  return (
    <div className="dashboard laboratory-page">
      <h2 className="dashboard-title">🧪 Laboratory Management System</h2>
      
      {/* Statistics Dashboard */}
      <div className="lab-stats">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <p className="stat-number">{stats.totalAssignments}</p>
            <p className="stat-label">Total Assignments</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <p className="stat-number">{stats.pendingResults}</p>
            <p className="stat-label">Pending Results</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <div>
            <p className="stat-number">{stats.completedTests}</p>
            <p className="stat-label">Completed Tests</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔬</span>
          <div>
            <p className="stat-number">{stats.totalTests}</p>
            <p className="stat-label">Total Tests</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="lab-tabs">
        <button 
          className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
          onClick={() => setActiveTab('assign')}
        >
          📋 Assign Tests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📊 Upload Results
        </button>
        <button 
          className={`tab-btn ${activeTab === 'print' ? 'active' : ''}`}
          onClick={() => setActiveTab('print')}
        >
          🖨️ Print Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="lab-content">
        {activeTab === 'assign' && <AssignTests />}
        {activeTab === 'upload' && <UploadResults />}
        {activeTab === 'print' && <PrintReports />}
      </div>
    </div>
  );
}

export default LaboratoryPage;
