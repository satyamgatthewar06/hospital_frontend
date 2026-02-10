import React, { useState, useContext, useMemo, useEffect } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import WorkflowStepper from '../components/Laboratory/WorkflowStepper';
import '../styles/LaboratoryModule.css';
import {
  Activity,
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  FileText,
  TestTube,
  ClipboardList,
  User,
  Settings,
  Printer,
  Microscope,
  flask,
  Check,
  Download,
  X,
  AlertTriangle,
  Filter,
  UserPlus,
  ShieldCheck,
  Stamp,
  Share2,
  Mail,
  MessageCircle,
  FileText as FileIcon,
  UploadCloud,
  History,
  CreditCard
} from 'lucide-react';

const LaboratoryModule = () => {
  const ctx = useContext(HospitalContext);
  const {
    labTests, // Master
    labRequests, // Active Requests
    addLabTest, updateLabTest, deleteLabTest,
    addLabRequest, updateLabRequest
  } = ctx;

  const [activeModule, setActiveModule] = useState('dashboard');

  // Workflow State
  const [workflowStep, setWorkflowStep] = useState(0);
  const [stepCompletion, setStepCompletion] = useState({
    testMaster: false,
    collection: false,
    assignment: false,
    processing: false,
    resultEntry: false,
    verification: false,
    billing: false,
    reports: false
  });

  // Define Workflow Steps
  const WORKFLOW_STEPS = [
    { id: 'testMaster', label: 'Test Master', module: 'master' },
    { id: 'collection', label: 'Sample Collection', module: 'collection' },
    { id: 'assignment', label: 'Assignment', module: 'assignment' },
    { id: 'processing', label: 'Processing', module: 'tracking' },
    { id: 'resultEntry', label: 'Result Entry', module: 'entry' },
    { id: 'verification', label: 'Verification', module: 'verification' },
    { id: 'billing', label: 'Billing', module: 'billing' },
    { id: 'reports', label: 'Reports', module: 'reports' }
  ];

  // Use Context Data directly
  const testDefinitions = labTests || [];


  // ================= SUB-COMPONENTS =================

  // 1. Dashboard Widgets
  const LabDashboard = () => {
    const [todaysRevenue, setTodaysRevenue] = useState(0);

    // Fetch Revenue (Bills)
    useEffect(() => {
      const fetchRevenue = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5000/api/laboratory/bills', { headers: { 'Authorization': `Bearer ${token}` } });
          const data = await res.json();
          if (data.success) {
            const today = new Date().toDateString();
            const total = data.data
              .filter(b => new Date(b.billDate).toDateString() === today)
              .reduce((sum, b) => sum + parseFloat(b.finalAmount || 0), 0);
            setTodaysRevenue(total);
          }
        } catch (e) { console.error("Dashboard Revenue Fetch Error:", e); }
      };
      fetchRevenue();
    }, []);

    const stats = useMemo(() => {
      const today = new Date().toDateString();
      const allActive = labRequests || [];

      const todayReqs = allActive.filter(r => new Date(r.collectionDate || r.createdAt).toDateString() === today);
      const highPriority = allActive.filter(r => r.priority === 'High' && r.status !== 'Completed');
      const processing = allActive.filter(r => r.status === 'Processing' || r.status === 'Sample Collected');

      // Workload Calculation
      const workloadMap = {};
      const technicians = ctx.staff?.filter(s => s.role === 'Lab Technician') || [];
      technicians.forEach(t => workloadMap[t.name] = 0); // Init

      allActive.forEach(r => {
        if (r.status !== 'Completed' && r.technicianName) {
          workloadMap[r.technicianName] = (workloadMap[r.technicianName] || 0) + 1;
        }
      });

      return {
        totalToday: todayReqs.length,
        pendingTotal: processing.length,
        highPriority: highPriority.length,
        completedToday: todayReqs.filter(r => r.status === 'Completed').length,
        workload: workloadMap
      };
    }, [labRequests, ctx.staff]);

    return (
      <div className="lab-dashboard fade-in">
        <div style={{ marginBottom: '20px' }}>
          <h2>📊 Laboratory Dashboard</h2>
          <p className="subtitle">Real-time overview of lab operations.</p>
        </div>

        {/* Key Metrics Row */}
        <div className="stats-grid">
          <div className="stat-item" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">Today's Tests</span>
              <microscope size={16} className="text-muted" />
            </div>
            <span className="stat-value">{stats.totalToday}</span>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{stats.completedToday} Completed</div>
          </div>

          <div className="stat-item" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">Pending Processing</span>
              <Clock size={16} className="text-muted" />
            </div>
            <span className="stat-value">{stats.pendingTotal}</span>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Active Samples</div>
          </div>

          <div className="stat-item" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">High Priority</span>
              <AlertTriangle size={16} color="#ef4444" />
            </div>
            <span className="stat-value" style={{ color: '#ef4444' }}>{stats.highPriority}</span>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Require Attention</div>
          </div>

          <div className="stat-item" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">Today's Revenue</span>
              <CreditCard size={16} className="text-muted" />
            </div>
            <span className="stat-value" style={{ color: '#10b981' }}>₹{todaysRevenue.toLocaleString()}</span>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Billed Today</div>
          </div>
        </div>

        {/* Workload Section */}
        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3>👨‍🔬 Technician Workload</h3>
            <div style={{ marginTop: '15px' }}>
              {Object.entries(stats.workload).map(([name, count], i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                    <span>{name}</span>
                    <span>{count} tests</span>
                  </div>
                  <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
                    <div style={{
                      width: `${Math.min((count / 10) * 100, 100)}%`,
                      background: count > 5 ? '#ef4444' : '#3b82f6',
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              ))}
              {Object.keys(stats.workload).length === 0 && <p className="text-muted">No technicians found.</p>}
            </div>
          </div>

          <div className="card">
            <h3>📉 Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
              <button className="btn btn-primary" onClick={() => setActiveModule('entry')}>
                <Plus size={16} /> Enter Results
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveModule('collection')}>
                <TestTube size={16} /> New Sample
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveModule('verification')}>
                <ShieldCheck size={16} /> Verify Reports
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveModule('billing')}>
                <CreditCard size={16} /> Generate Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2. Test Master
  const TestMaster = () => {
    const [view, setView] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
      id: null,
      testName: '',
      testCategory: 'Blood',
      price: '',
      sampleType: 'Blood',
      tat: '',
      normalRange: '',
      format: 'Table'
    });

    const filteredTests = testDefinitions.filter(t =>
      (t.testName || t.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (e) => {
      e.preventDefault();
      try {
        if (formData.id) await updateLabTest(formData.id, formData);
        else await addLabTest(formData);
        setView('list');
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <div className="fade-in">
        <div className="flex-between header-actions-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2>🧪 Test Master</h2>
            <p className="subtitle">Manage test definitions and pricing.</p>
          </div>
          {view === 'list' ? (
            <button className="btn btn-primary" onClick={() => {
              setFormData({ id: null, testName: '', testCategory: 'Blood', price: '', sampleType: 'Blood', tat: '', normalRange: '', format: 'Table' });
              setView('form');
            }}>
              <Plus size={16} style={{ marginRight: '8px' }} /> Add Test
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setView('list')}>Cancel</button>
          )}
        </div>

        {view === 'list' && (
          <div className="card">
            <div className="search-bar-container" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#A0AEC0" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', marginLeft: '10px', width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div className="table-responsive">
              <table className="std-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>TAT</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map(test => (
                    <tr key={test.id}>
                      <td><strong>{test.testName || test.name}</strong></td>
                      <td><span className="badge badge-info">{test.testCategory || test.category}</span></td>
                      <td>₹{test.price}</td>
                      <td>{test.tat}</td>
                      <td>
                        <button className="btn-icon" onClick={() => { setFormData(test); setView('form'); }}>
                          <Edit size={16} color="var(--primary)" />
                        </button>
                        <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) deleteLabTest(test.id); }}>
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'form' && (
          <div className="card">
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Test Name</label>
                  <input value={formData.testName} onChange={e => setFormData({ ...formData, testName: e.target.value })} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price (₹)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Normal Range</label>
                <input value={formData.normalRange} onChange={e => setFormData({ ...formData, normalRange: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {formData.id ? 'Update' : 'Create'} Test
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  // 3. Sample Collection
  const SampleCollection = () => {
    const [formData, setFormData] = useState({
      patientName: '',
      testName: '',
      sampleType: 'Blood',
      department: 'Hematology',
      technicianName: '',
      priority: 'Normal'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Extract patient ID from the selected patient
        const selectedPatient = ctx.patients?.find(p => p.name === formData.patientName);
        const patientId = selectedPatient?.id || null;

        await addLabRequest({
          reqId: `REQ-${Date.now().toString().slice(-4)}`,
          patientId: patientId,
          patientName: formData.patientName,
          testName: formData.testName,
          sampleType: formData.sampleType,
          collectionDate: new Date().toISOString(),
          status: 'Sample Collected',
          priority: formData.priority,
          technicianName: formData.technicianName
        });
        alert('Sample Collected Successfully!');
        setFormData({ patientName: '', testName: '', sampleType: 'Blood', department: 'Hematology', technicianName: '', priority: 'Normal' });
      } catch (error) {
        alert('Error: ' + error.message);
      }
    };

    return (
      <div className="fade-in">
        <h2>🩸 Sample Collection</h2>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Patient Name</label>
                <select
                  value={formData.patientName}
                  onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {ctx.patients && ctx.patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Test Name</label>
                <select value={formData.testName} onChange={e => setFormData({ ...formData, testName: e.target.value })} required>
                  <option value="">-- Select Test --</option>
                  {testDefinitions.map(t => <option key={t.id} value={t.testName || t.name}>{t.testName || t.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Sample Type</label>
                <select value={formData.sampleType} onChange={e => setFormData({ ...formData, sampleType: e.target.value })}>
                  <option>Blood</option>
                  <option>Urine</option>
                  <option>Swab</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Department</label>
                <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                  <option>Hematology</option>
                  <option>Biochemistry</option>
                  <option>Microbiology</option>
                  <option>Pathology</option>
                  <option>Serology</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Technician</label>
                <select
                  value={formData.technicianName}
                  onChange={e => setFormData({ ...formData, technicianName: e.target.value })}
                  required
                >
                  <option value="">-- Select Technician --</option>
                  {ctx.staff && ctx.staff.map(s => {
                    const staffName = s.name || s.firstName || s.staffName || 'Unknown';
                    const staffRole = s.role || s.designation || 'Staff';
                    return (
                      <option key={s.id} value={staffName}>
                        {staffName} - {staffRole}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Collect Sample</button>
          </form>
        </div>
      </div>
    );
  };

  // 4. Sample Tracking & Processing
  const LabTracking = () => {
    const [selectedDept, setSelectedDept] = useState('All');

    // Filter by Dept
    const activeRequests = labRequests.filter(r => {
      const isNotComplete = r.status !== 'Completed' && r.status !== 'Report Generated';
      const matchesDept = selectedDept === 'All' || r.department === selectedDept;
      return isNotComplete && matchesDept;
    });

    const updateStatus = async (id, status) => {
      // Find current req to append to timeline
      const req = labRequests.find(r => r.id === id);
      const newTimeline = [...(req.timeline || []), { status, timestamp: new Date().toISOString() }];

      await updateLabRequest(id, { status, timeline: newTimeline });
    };

    // Helper to check delays
    const checkStatus = (req) => {
      const now = new Date();
      const lastUpdate = req.timeline && req.timeline.length > 0
        ? new Date(req.timeline[req.timeline.length - 1].timestamp)
        : new Date(req.collectionDate); // Fallback

      const diffHours = (now - lastUpdate) / (1000 * 60 * 60);
      const isMissing = diffHours > 24 && req.status !== 'Completed';
      const isDelayed = diffHours > 2;

      return { isMissing, isDelayed, diffHours };
    };

    const getStatusStep = (status) => {
      if (status === 'Sample Collected') return 1;
      if (status === 'Processing') return 2;
      return 3;
    };

    return (
      <div className="fade-in">
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📍 Sample Tracking & Processing</h2>

          <div className="filter-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="All">All Departments</option>
              <option>Hematology</option>
              <option>Biochemistry</option>
              <option>Microbiology</option>
              <option>Pathology</option>
              <option>Serology</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="std-table">
              <thead>
                <tr>
                  <th>Info</th>
                  <th>Department</th>
                  <th>Live Tracking</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeRequests.map(req => {
                  const { isMissing, isDelayed } = checkStatus(req);
                  const step = getStatusStep(req.status);

                  return (
                    <tr key={req.id} style={{ backgroundColor: isMissing ? '#FFF5F5' : 'inherit' }}>
                      <td>
                        <div style={{ fontWeight: 'bold' }}>{req.reqId}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{req.patientName}</div>
                        <div style={{ fontSize: '0.8rem' }}>{req.testName}</div>
                        {isMissing && <div style={{ color: 'red', fontSize: '0.7rem', display: 'flex', alignItems: 'center' }}><AlertTriangle size={10} /> Missing Sample</div>}
                        {isDelayed && !isMissing && <div style={{ color: 'orange', fontSize: '0.7rem', display: 'flex', alignItems: 'center' }}><Clock size={10} /> Delayed</div>}
                      </td>
                      <td>
                        <span className="badge badge-info">{req.department || 'General'}</span>
                      </td>
                      <td style={{ minWidth: '200px' }}>
                        {/* Simple CSS Stepper */}
                        <div className="stepper-track">
                          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '5px' }}>
                          <span>Collected</span>
                          <span>Processing</span>
                          <span>Done</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${req.status === 'Sample Collected' ? 'primary' : 'warning'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'Sample Collected' && (
                          <button className="btn btn-secondary btn-icon" onClick={() => updateStatus(req.id, 'Processing')}>
                            Start Process
                          </button>
                        )}
                        {req.status === 'Processing' && (
                          <button className="btn btn-primary btn-icon" onClick={() => updateStatus(req.id, 'Completed')}>
                            Complete <CheckCircle size={14} style={{ marginLeft: 5 }} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {activeRequests.length === 0 && <tr><td colSpan="5" className="text-secondary" style={{ textAlign: 'center' }}>No pending active samples.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  };

  // 5. Reports (Updated with Print Logic)
  const Reports = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    // Show only COMPLETED (Verified) reports
    const completedRequests = labRequests.filter(r => r.status === 'Completed' && r.isVerified == 1);

    const handleShare = async (method) => {
      const recipient = method === 'whatsapp' ? prompt("Enter WhatsApp Number:") : prompt("Enter Email Address:");
      if (!recipient) return;

      // Optimistic UI Update
      const newLog = { method, recipient, timestamp: new Date().toISOString(), status: 'Sent' };
      const updatedHistory = [...(JSON.parse(selectedReport.shareHistory || '[]')), newLog];

      // Update local state (mock)
      const updatedReport = { ...selectedReport, shareHistory: JSON.stringify(updatedHistory) };
      setSelectedReport(updatedReport);

      // Update Backend
      await updateLabRequest(selectedReport.id, { shareHistory: JSON.stringify(updatedHistory) });

      if (method === 'whatsapp') {
        window.open(`https://wa.me/${recipient}?text=Your Lab Report is ready. Report ID: ${selectedReport.reqId}`, '_blank');
      } else if (method === 'email') {
        window.open(`mailto:${recipient}?subject=Lab Report ${selectedReport.reqId}&body=Your report is attached.`, '_blank');
      }
    };

    const handleDownload = async () => {
      // Log Download
      const newLog = { type: 'PDF', timestamp: new Date().toISOString() };
      const updatedHistory = [...(JSON.parse(selectedReport.downloadHistory || '[]')), newLog];

      await updateLabRequest(selectedReport.id, { downloadHistory: JSON.stringify(updatedHistory) });
      const updatedReport = { ...selectedReport, downloadHistory: JSON.stringify(updatedHistory) };
      setSelectedReport(updatedReport);

      window.print();
    };

    if (selectedReport) {
      return (
        <div className="fade-in">
          <div className="flex-between" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>← Back to List</button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => handleShare('whatsapp')} style={{ background: '#25D366', borderColor: '#25D366' }}>
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button className="btn btn-primary" onClick={() => handleShare('email')} style={{ background: '#EA4335', borderColor: '#EA4335' }}>
                <Mail size={16} /> Email
              </button>
              <button className="btn btn-primary" onClick={() => alert('Uploaded to Doctor Portal!')} style={{ background: '#3b82f6', borderColor: '#3b82f6' }}>
                <UploadCloud size={16} /> Doctor Portal
              </button>
              <button className="btn btn-secondary" onClick={handleDownload} style={{ background: '#4a5568', color: 'white' }}>
                <Download size={16} /> Download
              </button>
            </div>
          </div>

          <div id="printable-report" style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>CITY HOSPITAL</h1>
              <p style={{ margin: 0, color: '#666' }}>123 Health Avenue, Medical District</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div>
                <p><strong>Patient Name:</strong> {selectedReport.patientName}</p>
                <p><strong>Patient ID:</strong> {selectedReport.patientId || 'N/A'}</p>
                <p><strong>Age/Gender:</strong> 34 / M</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p><strong>Report ID:</strong> {selectedReport.reqId}</p>
                <p><strong>Date:</strong> {selectedReport.collectionDate}</p>
                <p><strong>Ref. By:</strong> Dr. Strange</p>
              </div>
            </div>

            <h3 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px' }}>
              {selectedReport.testName} REPORT
            </h3>

            <table className="std-table" style={{ marginBottom: '30px' }}>
              <thead>
                <tr>
                  <th>Investigation</th>
                  <th>Result</th>
                  <th>Reference Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedReport.testName}</td>
                  <td><strong>{selectedReport.testResult || 'Normal'}</strong></td>
                  <td>{selectedReport.normalRangeRef || 'N/A'}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p><strong>Technician:</strong> {selectedReport.technicianName || 'Lab Staff'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p><strong>Authorized Signatory</strong></p>
                <p style={{ marginTop: '30px' }}>(Pathologist)</p>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4><History size={16} /> Communication History</h4>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              {(JSON.parse(selectedReport.shareHistory || '[]')).map((log, i) => (
                <div key={i}>• Shared via <strong>{log.method}</strong> to {log.recipient} on {new Date(log.timestamp).toLocaleString()}</div>
              ))}
              {(JSON.parse(selectedReport.downloadHistory || '[]')).map((log, i) => (
                <div key={'d' + i}>• Downloaded ({log.type}) on {new Date(log.timestamp).toLocaleString()}</div>
              ))}
              {!selectedReport.shareHistory && !selectedReport.downloadHistory && <div>No history available.</div>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fade-in">
        <h2>📄 Lab Reports</h2>
        <div className="card">
          <div className="table-responsive">
            <table className="std-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Patient</th>
                  <th>Test</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {completedRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.reqId}</td>
                    <td>{req.patientName}</td>
                    <td>{req.testName}</td>
                    <td>{req.collectionDate}</td>
                    <td>
                      <button className="btn btn-primary btn-icon" onClick={() => setSelectedReport(req)}>
                        <Printer size={16} /> View & Print
                      </button>
                    </td>
                  </tr>
                ))}
                {completedRequests.length === 0 && <tr><td colSpan="5" className="text-secondary" style={{ textAlign: 'center' }}>No completed reports.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6. Test Assignment Submodule
  const TestAssignment = () => {
    const [selectedTests, setSelectedTests] = useState([]);

    // Get Technicians Only
    const technicians = ctx.staff?.filter(s => s.role === 'Lab Technician' || s.role === 'Nurse') || [];

    // Calculate Workload
    const workload = useMemo(() => {
      const load = {};
      technicians.forEach(t => load[t.id] = 0);

      // Count active assignments
      labRequests.forEach(req => {
        if (req.status !== 'Completed' && req.technicianId) {
          load[req.technicianId] = (load[req.technicianId] || 0) + 1;
        }
      });
      return load;
    }, [labRequests, technicians]);

    // Pending Tests (Collected but no technician assigned OR explicitly waiting)
    // Assuming for now 'Sample Collected' tests need assignment if not already assigned
    const pendingTests = labRequests.filter(r =>
      r.status === 'Sample Collected' && !r.technicianId
    );

    const handleAssign = async (reqId, techId, techName) => {
      await updateLabRequest(reqId, { technicianId: techId, technicianName: techName });
    };

    const handleAutoAssign = async () => {
      if (technicians.length === 0) return alert('No technicians available!');

      let updatedCount = 0;
      // Simple Round-Robin / Lowest Load Logic
      for (const req of pendingTests) {
        // Find tech with lowest load
        const bestTech = technicians.reduce((prev, curr) =>
          (workload[prev.id] < workload[curr.id]) ? prev : curr
        );

        await handleAssign(req.id, bestTech.id, bestTech.name);
        workload[bestTech.id]++; // Update local mock load to keep balancing
        updatedCount++;
      }
      alert(`Auto-assigned ${updatedCount} tests.`);
    };

    return (
      <div className="fade-in">
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>📋 Test Assignment</h2>
            <p className="subtitle">Manage technician workload and assignments</p>
          </div>
          <button className="btn btn-primary" onClick={handleAutoAssign}>
            <Activity size={16} style={{ marginRight: 5 }} /> Auto-Assign ({pendingTests.length})
          </button>
        </div>

        {/* Workload Section */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Technician Workload</h3>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {technicians.map(tech => (
            <div className="stat-item" key={tech.id} style={{ borderLeft: `4px solid ${workload[tech.id] > 5 ? '#e53e3e' : '#38a169'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span className="stat-label" style={{ marginBottom: 0 }}>{tech.name}</span>
                <User size={16} color="#718096" />
              </div>
              <div style={{ marginTop: '10px' }}>
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>{workload[tech.id] || 0}</span>
                <span style={{ fontSize: '0.8rem', color: '#718096', marginLeft: '5px' }}>active tests</span>
              </div>
            </div>
          ))}
          {technicians.length === 0 && <p style={{ color: '#718096' }}>No technicians found.</p>}
        </div>

        {/* Pending Assignments */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', marginTop: '2rem' }}>Pending Assignments</h3>
        <div className="card">
          <div className="table-responsive">
            <table className="std-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Test / Dept</th>
                  <th>Priority</th>
                  <th>Assign To</th>
                </tr>
              </thead>
              <tbody>
                {pendingTests.map(req => (
                  <tr key={req.id}>
                    <td>{req.reqId}</td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{req.testName}</div>
                      <div className="badge badge-info">{req.department}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${req.priority === 'High' ? 'danger' : 'success'}`}>
                        {req.priority || 'Normal'}
                      </span>
                    </td>
                    <td>
                      <select
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                        onChange={(e) => {
                          const tech = technicians.find(t => t.id.toString() === e.target.value);
                          if (tech) handleAssign(req.id, tech.id, tech.name);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Tech</option>
                        {technicians.map(t => (
                          <option key={t.id} value={t.id}>{t.name} (Load: {workload[t.id]})</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {pendingTests.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>No pending assignments.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 7. Billing & Insurance Submodule
  const LabBilling = () => {
    const [view, setView] = useState('pending'); // pending | history
    const [selectedReq, setSelectedReq] = useState(null);
    const [bills, setBills] = useState([]);

    // Billing Form State
    const [discount, setDiscount] = useState(0);
    const [isCashless, setIsCashless] = useState(false);
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');

    // Fetch existing bills on mount
    useEffect(() => {
      const fetchBills = async () => {
        try {
          const token = localStorage.getItem('token');
          // Fetch from our new backend endpoint
          const res = await fetch('http://localhost:5000/api/laboratory/bills', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setBills(data.data);
          }
        } catch (e) { console.error("Billing Fetch Error:", e); }
      };
      fetchBills();
    }, []);

    // Pending: Completed Requests that don't have a bill yet (Mock logic: assume no bill if not in bills array)
    // Note: In real app, we would match reqId with bill.reqId
    const pendingBilling = labRequests.filter(r => (r.status === 'Completed' || r.status === 'Report Generated'));
    // Optimization: Filter out ones that are already billed
    const unbilled = pendingBilling.filter(r => !bills.find(b => b.reqId === r.id));

    const handleGenerateBill = async () => {
      if (!selectedReq) return;

      // Calculate Attributes
      // Find price from definition or default
      const testDef = testDefinitions.find(t => t.testName === selectedReq.testName || t.name === selectedReq.testName);
      const price = parseFloat(testDef?.price || 500);
      const discountAmt = (price * discount) / 100;
      const subTotal = price - discountAmt;
      const gst = subTotal * 0.18; // 18% GST
      const finalAmount = subTotal + gst;

      const billData = {
        billNo: `INV-${Date.now()}`,
        billDate: new Date().toISOString(),
        reqId: selectedReq.id,
        patientName: selectedReq.patientName,
        testName: selectedReq.testName,
        totalAmount: price,
        discount: discountAmt,
        gst: gst,
        finalAmount: finalAmount.toFixed(2),
        paymentMode: isCashless ? 'Insurance' : 'Cash',
        status: 'Paid',
        isCashless,
        insuranceProvider: isCashless ? insuranceProvider : null,
        policyNumber: isCashless ? policyNumber : null
      };

      try {
        // Mock API Call
        await fetch('/api/laboratory/bills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(billData)
        });

        setBills([...bills, billData]);
        alert(`Bill Generated! Amount: ₹${billData.finalAmount}`);
        setSelectedReq(null);
        setView('history');
      } catch (e) {
        alert('Billing failed: ' + e.message);
      }
    };

    if (selectedReq) {
      const testDef = testDefinitions.find(t => t.testName === selectedReq.testName || t.name === selectedReq.testName);
      const price = parseFloat(testDef?.price || 500);
      const finalAmt = (price - (price * discount / 100)) * 1.18;

      return (
        <div className="fade-in">
          <button className="btn btn-secondary" onClick={() => setSelectedReq(null)} style={{ marginBottom: '1rem' }}>← Back</button>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>🧾 Generate Invoice</h3>
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '15px' }}>
              <p><strong>Patient:</strong> {selectedReq.patientName}</p>
              <p><strong>Test:</strong> {selectedReq.testName}</p>
              <p><strong>Base Price:</strong> ₹{price}</p>
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} min="0" max="100" />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={isCashless} onChange={e => setIsCashless(e.target.checked)} id="cashless" />
              <label htmlFor="cashless" style={{ marginBottom: 0 }}>Cashless Insurance?</label>
            </div>

            {isCashless && (
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Provider</label>
                  <input value={insuranceProvider} onChange={e => setInsuranceProvider(e.target.value)} placeholder="e.g. Star Health" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Policy No</label>
                  <input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} placeholder="XYZ-1234" />
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', padding: '15px', borderTop: '2px dashed #ccc', textAlign: 'right' }}>
              <h4>Total Payable: <span style={{ color: '#2563eb', fontSize: '1.5rem' }}>₹{finalAmt.toFixed(2)}</span></h4>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>(Includes 18% GST)</p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={handleGenerateBill}>
              <Printer size={16} /> Generate & Print Bill
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fade-in">
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>💳 Billing & Insurance</h2>
          <div className="tabs-navigation" style={{ marginBottom: 0 }}>
            <button className={`tab-btn ${view === 'pending' ? 'active' : ''}`} onClick={() => setView('pending')}>Pending</button>
            <button className={`tab-btn ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>History</button>
          </div>
        </div>

        {view === 'pending' && (
          <div className="card">
            <div className="table-responsive">
              <table className="std-table">
                <thead>
                  <tr>
                    <th>Req ID</th>
                    <th>Patient</th>
                    <th>Test</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {unbilled.map(req => (
                    <tr key={req.id}>
                      <td>{req.reqId}</td>
                      <td>{req.patientName}</td>
                      <td>{req.testName}</td>
                      <td><span className="badge badge-success">{req.status}</span></td>
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => setSelectedReq(req)}>Generate Bill</button>
                      </td>
                    </tr>
                  ))}
                  {unbilled.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No pending bills.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="card">
            <p>Bill History (Local Session):</p>
            <div className="table-responsive">
              <table className="std-table">
                <thead>
                  <tr>
                    <th>Bill No</th>
                    <th>Patient</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b, i) => (
                    <tr key={i}>
                      <td>{b.billNo}</td>
                      <td>{b.patientName}</td>
                      <td>₹{b.finalAmount}</td>
                      <td>{b.paymentMode} {b.isCashless ? `(${b.insuranceProvider})` : ''}</td>
                      <td>{new Date(b.billDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {bills.length === 0 && <tr><td colSpan="5">No bills generated in this session.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 8. Result Entry Panel
  const ResultEntry = () => {
    const [selectedReq, setSelectedReq] = useState(null);

    // Form State
    const [results, setResults] = useState([]); // Array of { param, value, unit, range, remark }
    const [textResult, setTextResult] = useState('');
    const [templateType, setTemplateType] = useState('Table'); // Table or Text
    const [pathologistRemark, setPathologistRemark] = useState('');

    const processingRequests = labRequests.filter(r => r.status === 'Processing');

    // Auto-Populate Form on Selection
    useEffect(() => {
      if (selectedReq) {
        // Check if test definition exists to get template info
        const def = testDefinitions.find(t => (t.testName === selectedReq.testName || t.name === selectedReq.testName));
        const type = def?.format || 'Table';
        setTemplateType(type);

        if (type === 'Table') {
          // Mock parameters if definition doesn't have them yet (In real app, fetch from master)
          setResults([
            { param: selectedReq.testName, value: '', unit: '', range: def?.normalRange || '10-20' }
          ]);
        } else {
          setTextResult('');
        }
        setPathologistRemark('');
      }
    }, [selectedReq, testDefinitions]);


    // Validation Logic
    const checkRange = (val, range) => {
      if (!range || !val) return 'normal';

      // Handle "10-20" format
      const parts = range.split('-').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const num = parseFloat(val);
        if (isNaN(num)) return 'normal';
        if (num < parts[0]) return 'low'; // Low
        if (num > parts[1]) return 'high'; // High
      }
      return 'normal';
    };

    const handleSaveResult = async () => {
      if (!selectedReq) return;

      // Construct Final Result Blob
      const finalResult = templateType === 'Table' ? JSON.stringify(results) : textResult;

      await updateLabRequest(selectedReq.id, {
        status: 'Report Generated', // Logic change: Status remains 'Report Generated' until verified
        testResult: finalResult,
        resultType: templateType,
        pathologistRemark: pathologistRemark,
        reportDate: new Date().toISOString(),
        isVerified: 0, // Explicitly not verified yet
        verifiedBy: null,
        // Append to timeline
        timeline: [...(selectedReq.timeline || []), { status: 'Report Generated', timestamp: new Date().toISOString() }]
      });

      alert('Result Entered! Sent for Verification.');
      setSelectedReq(null);
    };

    if (selectedReq) {
      return (
        <div className="fade-in">
          <div className="flex-between" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedReq(null)}>← Back to List</button>
            <h2>📝 Enter Results: {selectedReq.testName}</h2>
          </div>

          <div className="card">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              <div><strong>Patient:</strong> {selectedReq.patientName}</div>
              <div><strong>Req ID:</strong> {selectedReq.reqId}</div>
              <div><strong>Dept:</strong> {selectedReq.department}</div>
              <div>
                <strong>Template: </strong>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option>Table</option>
                  <option>Descriptive</option>
                </select>
              </div>
            </div>

            {templateType === 'Table' && (
              <div className="table-responsive">
                <table className="std-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Observed Value</th>
                      <th>Unit</th>
                      <th>Reference Range</th>
                      <th>Flag</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, idx) => {
                      const flag = checkRange(row.value, row.range);
                      return (
                        <tr key={idx}>
                          <td><input value={row.param} onChange={(e) => {
                            const list = [...results]; list[idx].param = e.target.value; setResults(list);
                          }} style={{ width: '100%', padding: '5px' }} /></td>

                          <td><input value={row.value} type="number" onChange={(e) => {
                            const list = [...results]; list[idx].value = e.target.value; setResults(list);
                          }} style={{ width: '100%', padding: '5px', border: flag === 'high' ? '2px solid red' : flag === 'low' ? '2px solid orange' : '1px solid #ccc' }} /></td>

                          <td><input value={row.unit} onChange={(e) => {
                            const list = [...results]; list[idx].unit = e.target.value; setResults(list);
                          }} style={{ width: '80px', padding: '5px' }} /></td>

                          <td><input value={row.range} onChange={(e) => {
                            const list = [...results]; list[idx].range = e.target.value; setResults(list);
                          }} style={{ width: '100%', padding: '5px' }} /></td>

                          <td>
                            {flag === 'high' && <span className="badge badge-danger">High</span>}
                            {flag === 'low' && <span className="badge badge-warning">Low</span>}
                            {flag === 'normal' && <span className="badge badge-success">Ok</span>}
                          </td>
                          <td><button onClick={() => {
                            const list = [...results]; list.splice(idx, 1); setResults(list);
                          }} className="btn-icon"><X size={14} color="red" /></button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <button className="btn btn-secondary" style={{ marginTop: '10px' }} onClick={() => {
                  setResults([...results, { param: '', value: '', unit: '', range: '' }]);
                }}>+ Add Parameter</button>
              </div>
            )}

            {templateType === 'Descriptive' && (
              <div className="form-group">
                <label>Report Details</label>
                <textarea
                  rows="8"
                  value={textResult}
                  onChange={(e) => setTextResult(e.target.value)}
                  placeholder="Enter detailed report findings..."
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                ></textarea>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Pathologist Remark</label>
              <textarea
                rows="2"
                value={pathologistRemark}
                onChange={(e) => setPathologistRemark(e.target.value)}
                placeholder="Optional remarks..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              ></textarea>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={handleSaveResult}>
                <CheckCircle size={16} style={{ marginRight: 5 }} /> Save & Generate Report
              </button>
            </div>
          </div>
        </div>
      );
    } // End Result Entry View

    return (
      <div className="fade-in">
        <h2>📝 Result Entry Panel</h2>
        <div className="card">
          <div className="table-responsive">
            <table className="std-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Info</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {processingRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.reqId}</td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{req.testName}</div>
                      <div style={{ fontSize: '0.85rem' }}>{req.patientName}</div>
                    </td>
                    <td><span className="badge badge-warning">Processing</span></td>
                    <td>
                      <button className="btn btn-primary btn-icon" onClick={() => setSelectedReq(req)}>
                        <Edit size={16} /> Enter Results
                      </button>
                    </td>
                  </tr>
                ))}
                {processingRequests.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#718096' }}>No pending results to enter.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

  };

  // 8. Result Verification Submodule
  const ResultVerification = () => {
    const [selectedReq, setSelectedReq] = useState(null);

    // Filter for requests that have results but are NOT verified
    // We assume 'Report Generated' status means result is entered but maybe not verified
    // We check 'isVerified' flag. If undefined, assume false.
    const pendingVerification = labRequests.filter(r =>
      (r.status === 'Report Generated') && (!r.isVerified || r.isVerified == 0)
    );

    const handleVerify = async () => {
      if (!selectedReq) return;

      if (!window.confirm('Are you sure you want to verify this report? This will add your digital signature.')) return;

      const verifierName = "Dr. Pathologist"; // Mock current user

      await updateLabRequest(selectedReq.id, {
        status: 'Completed', // Final status
        isVerified: 1,
        verifiedBy: verifierName,
        verifiedDate: new Date().toISOString(),
        timeline: [...(selectedReq.timeline || []), { status: 'Verified & Completed', timestamp: new Date().toISOString() }]
      });

      alert('Report Verified and Finalized!');
      setSelectedReq(null);
    };

    if (selectedReq) {
      const results = selectedReq.resultType === 'Table' ? JSON.parse(selectedReq.testResult || '[]') : [];

      return (
        <div className="fade-in">
          <div className="flex-between" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedReq(null)}>← Back to List</button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-danger" onClick={() => {
                // Logic to reject/send back could go here
                alert('Reject feature can be implemented to send back to processing.');
              }}>Reject</button>
              <button className="btn btn-success" onClick={handleVerify}>
                <ShieldCheck size={16} style={{ marginRight: 5 }} /> Verify & Sign
              </button>
            </div>
          </div>

          <div className="card">
            <h3>🛡️ Verify Report: {selectedReq.testName}</h3>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div><strong>Patient:</strong> {selectedReq.patientName}</div>
                <div><strong>Age/Gender:</strong> 34 / M</div>
                <div><strong>Ref. By:</strong> Dr. Strange</div>
                <div><strong>Sample Date:</strong> {new Date(selectedReq.collectionDate).toLocaleDateString()}</div>
                <div><strong>Technician:</strong> {selectedReq.technicianName || 'N/A'}</div>
              </div>
            </div>

            {selectedReq.resultType === 'Descriptive' ? (
              <div className="report-preview" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedReq.testResult}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="std-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                      <th>Unit</th>
                      <th>Ref. Range</th>
                      <th>Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, idx) => {
                      // Re-run check logic for display
                      let flag = 'normal';
                      if (row.range && row.value) {
                        const parts = row.range.split('-').map(s => parseFloat(s.trim()));
                        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                          const num = parseFloat(row.value);
                          if (!isNaN(num)) {
                            if (num < parts[0]) flag = 'low';
                            if (num > parts[1]) flag = 'high';
                          }
                        }
                      }

                      return (
                        <tr key={idx}>
                          <td>{row.param}</td>
                          <td style={{ fontWeight: 'bold' }}>{row.value}</td>
                          <td>{row.unit}</td>
                          <td>{row.range}</td>
                          <td>
                            {flag === 'high' && <span className="badge badge-danger">High</span>}
                            {flag === 'low' && <span className="badge badge-warning">Low</span>}
                            {flag === 'normal' && <span className="badge badge-success">Ok</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReq.pathologistRemark && (
              <div style={{ marginTop: '20px', padding: '10px', background: '#fff7ed', borderLeft: '4px solid #f97316' }}>
                <strong>Technician Remark:</strong> {selectedReq.pathologistRemark}
              </div>
            )}

          </div>
        </div>
      );
    }

    return (
      <div className="fade-in">
        <h2>🛡️ Result Verification</h2>
        <p className="subtitle">Review and verify reports generated by technicians.</p>
        <div className="card">
          <div className="table-responsive">
            <table className="std-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Patient</th>
                  <th>Test</th>
                  <th>Result Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingVerification.map(req => (
                  <tr key={req.id}>
                    <td>{req.reqId}</td>
                    <td>{req.patientName}</td>
                    <td>{req.testName}</td>
                    <td>{new Date(req.reportDate).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-primary btn-icon" onClick={() => setSelectedReq(req)}>
                        <ShieldCheck size={16} /> Verify
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingVerification.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>No reports pending verification.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ================= WORKFLOW FUNCTIONS =================

  // Validate if a step is complete
  const validateStep = (stepId) => {
    switch (stepId) {
      case 'testMaster':
        return labTests && labTests.length > 0;
      case 'collection':
        return labRequests && labRequests.length > 0;
      case 'assignment':
        return labRequests && labRequests.some(r => r.technicianId);
      case 'processing':
        return labRequests && labRequests.some(r => r.status === 'Processing' || r.status === 'Completed');
      case 'resultEntry':
        return labRequests && labRequests.some(r => r.testResult);
      case 'verification':
        return labRequests && labRequests.some(r => r.isVerified === 1);
      case 'billing':
        return true; // Always allow billing step
      case 'reports':
        return labRequests && labRequests.some(r => r.status === 'Completed' && r.isVerified === 1);
      default:
        return false;
    }
  };

  // Handle Next button
  const handleNext = () => {
    if (workflowStep < WORKFLOW_STEPS.length - 1) {
      const currentStepId = WORKFLOW_STEPS[workflowStep].id;
      if (validateStep(currentStepId)) {
        setStepCompletion({ ...stepCompletion, [currentStepId]: true });
        setWorkflowStep(workflowStep + 1);
        setActiveModule(WORKFLOW_STEPS[workflowStep + 1].module);
      } else {
        alert(`Please complete ${WORKFLOW_STEPS[workflowStep].label} before proceeding.\n\nRequirement: ${getStepRequirement(currentStepId)}`);
      }
    }
  };

  // Handle Previous button
  const handlePrevious = () => {
    if (workflowStep > 0) {
      setWorkflowStep(workflowStep - 1);
      setActiveModule(WORKFLOW_STEPS[workflowStep - 1].module);
    }
  };

  // Handle step click in stepper
  const handleStepClick = (stepIndex) => {
    if (stepIndex <= workflowStep) {
      setWorkflowStep(stepIndex);
      setActiveModule(WORKFLOW_STEPS[stepIndex].module);
    }
  };

  // Get step requirement message
  const getStepRequirement = (stepId) => {
    switch (stepId) {
      case 'testMaster':
        return 'Add at least one test definition';
      case 'collection':
        return 'Collect at least one sample';
      case 'assignment':
        return 'Assign at least one test to a technician';
      case 'processing':
        return 'Mark at least one sample as Processing or Completed';
      case 'resultEntry':
        return 'Enter results for at least one test';
      case 'verification':
        return 'Verify at least one test result';
      case 'billing':
        return 'Generate bills for verified tests';
      case 'reports':
        return 'Complete and verify at least one test';
      default:
        return 'Complete the current step';
    }
  };

  return (
    <div className="laboratory-module">
      <h1 style={{ marginBottom: '1.5rem' }}>🧪 Laboratory Management - Sequential Workflow</h1>

      {/* Workflow Stepper */}
      <WorkflowStepper
        steps={WORKFLOW_STEPS}
        currentStep={workflowStep}
        onStepClick={handleStepClick}
        stepCompletion={stepCompletion}
      />

      {/* Current Step Content */}
      <div className="lab-content">
        {workflowStep === 0 && <TestMaster />}
        {workflowStep === 1 && <SampleCollection />}
        {workflowStep === 2 && <TestAssignment />}
        {workflowStep === 3 && <LabTracking />}
        {workflowStep === 4 && <ResultEntry />}
        {workflowStep === 5 && <ResultVerification />}
        {workflowStep === 6 && <LabBilling />}
        {workflowStep === 7 && <Reports />}
      </div>

      {/* Navigation Controls */}
      <div className="workflow-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={workflowStep === 0}
        >
          ← Previous
        </button>

        <div className="step-indicator">
          Step {workflowStep + 1} of {WORKFLOW_STEPS.length}: {WORKFLOW_STEPS[workflowStep].label}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={workflowStep === WORKFLOW_STEPS.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default LaboratoryModule;
