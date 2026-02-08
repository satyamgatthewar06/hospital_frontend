import React, { useState } from 'react';
import {
    FileText,
    Search,
    Plus,
    Download,
    Printer,
    Trash2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const ConsentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // State for new consent form
    const [newConsent, setNewConsent] = useState({
        type: 'General Treatment Consent',
        file: null
    });

    // Load initial data from localStorage if available, else use dummy data
    const [consents, setConsents] = useState(() => {
        const savedConsents = localStorage.getItem('hospital_consents');
        if (savedConsents) {
            return JSON.parse(savedConsents);
        }
        return [
            { id: 1, type: "General Treatment Consent", date: "2023-10-25", fileName: "General_Consent_Marathi.pdf", fileUrl: null },
            { id: 2, type: "Surgery Consent", date: "2023-10-26", fileName: "Surgery_Consent_Marathi.pdf", fileUrl: null },
            { id: 3, type: "Anesthesia Consent", date: "2023-10-27", fileName: "Anesthesia_Consent_Marathi.pdf", fileUrl: null },
            { id: 4, type: "Delivery Consent", date: "2023-10-28", fileName: "Delivery_Consent_Marathi.pdf", fileUrl: null },
            { id: 5, type: "Blood Transfusion Consent", date: "2023-10-29", fileName: "Blood_Transfusion_Marathi.pdf", fileUrl: null },
            { id: 6, type: "LAMA / DAMA Consent", date: "2023-10-30", fileName: "LAMA_DAMA_Consent_Marathi.pdf", fileUrl: null },
            { id: 7, type: "High Risk Consent", date: "2023-10-31", fileName: "High_Risk_Consent_Marathi.pdf", fileUrl: null },
        ];
    });

    // Save to localStorage whenever consents change
    React.useEffect(() => {
        try {
            localStorage.setItem('hospital_consents', JSON.stringify(consents));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert("Storage Limit Reached! \n\nThe browser's local storage is full because PDF files are being saved locally. \n\nPlease: \n1. Clear All Records \n2. Upload smaller PDF files for this demo.");
                console.error("LocalStorage Quota Exceeded", e);
            } else {
                console.error("Error saving to localStorage", e);
            }
        }
    }, [consents]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setNewConsent({ ...newConsent, file: file });
        } else {
            alert('Please upload a valid PDF file.');
        }
    };

    const handleAddConsent = (e) => {
        e.preventDefault();
        if (!newConsent.file) {
            alert("Please upload a PDF.");
            return;
        }

        // Limit file size to prevent localStorage quota exceeded errors (e.g., limit to 2MB)
        if (newConsent.file.size > 2 * 1024 * 1024) {
            alert("File is too large! Please upload a PDF smaller than 2MB for demo persistence.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const consentRecord = {
                id: Date.now(),
                type: newConsent.type,
                date: new Date().toISOString().split('T')[0],
                fileUrl: reader.result, // Base64 Data URL (Persists in localStorage)
                fileName: newConsent.file.name
            };

            const updatedConsents = [consentRecord, ...consents];
            setConsents(updatedConsents);

            setShowModal(false);
            setNewConsent({ type: 'General Treatment Consent', file: null });
            alert("Consent Saved Successfully!");
        };
        reader.readAsDataURL(newConsent.file);
    };

    const handleViewPdf = (consent) => {
        if (!consent.fileUrl) {
            alert("This is a demo record. In a real app, this would open the '" + consent.fileName + "' file.");
            return;
        }

        // Check for stale blob URLs from previous sessions
        if (consent.fileUrl.startsWith('blob:')) {
            alert("This file link has expired (it was from a previous session). Please delete this record and re-upload the PDF.");
            return;
        }

        // If it's a Base64 data URL, convert to Blob for better viewing experience
        if (consent.fileUrl.startsWith('data:')) {
            try {
                // simple conversion
                const distinctPdfWin = window.open("");
                distinctPdfWin.document.write(
                    `<iframe width='100%' height='100%' src='${consent.fileUrl}'></iframe>`
                );
            } catch (e) {
                console.error("Error opening PDF", e);
                // Fallback: try opening directly
                window.open(consent.fileUrl, '_blank');
            }
        }
    };

    const handlePrintPdf = (consent) => {
        if (!consent.fileUrl) {
            alert("This is a demo record. Upload a real file to test printing.");
            return;
        }

        if (consent.fileUrl.startsWith('blob:')) {
            alert("This file link has expired. Please re-upload.");
            return;
        }

        const win = window.open("", "_blank");
        win.document.write(
            `<iframe width='100%' height='100%' src='${consent.fileUrl}'></iframe>`
        );
        // Wait for iframe to load then print - simple approach for now or let user use browser print
    };

    const clearAllRecords = () => {
        if (window.confirm("Are you sure you want to delete all consent records?")) {
            setConsents([]);
            localStorage.removeItem('hospital_consents');
        }
    };

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📄 Consent PDF</h1>
                    <p style={{ color: '#718096' }}>Manage consent forms (Marathi / English).</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={clearAllRecords} style={{ color: '#E53E3E', borderColor: '#E53E3E' }}>
                        <Trash2 size={18} style={{ marginRight: '8px' }} /> Clear All
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Upload PDF
                    </button>
                </div>
            </div>

            <div className="card">
                <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} color="#3182CE" />
                        Consent List
                    </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', background: '#f7fafc', padding: '10px', borderRadius: '8px' }}>
                    <Search size={20} color="#A0AEC0" />
                    <input
                        type="text"
                        placeholder="Search by consent type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '16px' }}
                    />
                </div>

                <div className="table-responsive">
                    <table className="std-table">
                        <thead>
                            <tr>
                                <th>Consent Type</th>
                                <th>Uploaded Date</th>
                                <th>File Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consents.filter(c => c.type.toLowerCase().includes(searchTerm.toLowerCase())).map(consent => (
                                <tr key={consent.id}>
                                    <td><strong>{consent.type}</strong></td>
                                    <td>{consent.date}</td>
                                    <td>
                                        {consent.fileName}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleViewPdf(consent)}
                                                title="View PDF"
                                                style={{
                                                    background: '#EBF8FF',
                                                    color: '#3182CE',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <FileText size={16} /> View PDF
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handlePrintPdf(consent)}
                                                title="Print PDF"
                                                style={{
                                                    background: '#F0FFF4',
                                                    color: '#38A169',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <Printer size={16} /> Print
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginTop: 0 }}>📄 Upload Consent PDF</h2>
                        <form onSubmit={handleAddConsent}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Consent Type</label>
                                <select
                                    className="form-control"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                    value={newConsent.type}
                                    onChange={e => setNewConsent({ ...newConsent, type: e.target.value })}
                                >
                                    <option>General Treatment Consent</option>
                                    <option>Surgery Consent</option>
                                    <option>Anesthesia Consent</option>
                                    <option>Delivery Consent</option>
                                    <option>Blood Transfusion Consent</option>
                                    <option>LAMA / DAMA Consent</option>
                                    <option>High Risk Consent</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Select PDF File</label>
                                <div style={{ border: '2px dashed #cbd5e0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#718096' }}>Only .pdf files allowed</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsentsPage;
