import React, { useState } from 'react';
import { Search, Download, FileText, CheckCircle, Smartphone } from 'lucide-react';
import './PatientPortal.css'; // We'll create a small CSS file for this specific page

const PatientPortal = () => {
    const [searchId, setSearchId] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock Result Data
    const mockReportDB = {
        'REQ-7806': {
            patientName: 'Sanket Jadhav',
            test: 'Complete Blood Count (CBC)',
            date: '2026-02-04',
            status: 'Ready',
            fileUrl: '#'
        },
        'REQ-6208': {
            patientName: 'Aditi Sharma',
            test: 'Thyroid Profile',
            date: '2026-02-05',
            status: 'Ready',
            fileUrl: '#'
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setReport(null);

        // Simulate API call
        setTimeout(() => {
            const result = mockReportDB[searchId.toUpperCase()];
            if (result) {
                setReport(result);
            } else {
                alert('No report found with this ID. Please check and try again.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="portal-container">
            <div className="portal-card">
                <div className="portal-header">
                    <div className="brand-logo-large">
                        <div className="logo-icon-large">
                            <Smartphone size={32} color="white" />
                        </div>
                        <h1>WellNest Patient Portal</h1>
                    </div>
                    <p>Access your diagnostic reports securely from home.</p>
                </div>

                <form onSubmit={handleSearch} className="search-box-wrapper">
                    <div className="input-group">
                        <Search className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Enter Report ID (e.g., REQ-7806)"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-search" disabled={loading}>
                        {loading ? 'Searching...' : 'Find Report'}
                    </button>
                </form>

                {report && (
                    <div className="result-card fade-in">
                        <div className="result-header">
                            <CheckCircle size={24} color="#48BB78" />
                            <h3>Report Ready</h3>
                        </div>
                        <div className="result-details">
                            <p><strong>Patient:</strong> {report.patientName}</p>
                            <p><strong>Test:</strong> {report.test}</p>
                            <p><strong>Date:</strong> {report.date}</p>
                        </div>
                        <button className="btn-download">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                )}

                <div className="portal-footer">
                    <p>Need help? Call our support at <strong>+91 98765 43210</strong></p>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;
