import React, { useEffect, useState } from 'react';
import { fetchDoctors, addDoctor, updateDoctor, deleteDoctor } from '../services/doctorService';
import '../styles/DoctorsPage.css';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        email: '',
        phone: '',
        availability: '',
        mmcNumber: '',
        mmcCertificate: '',
        image: '',
    });

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        setLoading(true);
        try {
            const data = await fetchDoctors();
            setDoctors(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCertificateUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, mmcCertificate: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.specialization) {
            setError('Name and specialization are required');
            return;
        }

        try {
            if (editingId) {
                await updateDoctor(editingId, formData);
                setSuccessMessage('✓ Doctor updated successfully!');
            } else {
                await addDoctor(formData);
                setSuccessMessage('✓ Doctor added successfully!');
            }
            await loadDoctors();
            resetForm();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save doctor');
        }
    };

    const handleEdit = (doctor) => {
        setFormData(doctor);
        setEditingId(doctor.id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await deleteDoctor(id);
            await loadDoctors();
            setSuccessMessage('✓ Doctor deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to delete doctor');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            specialization: '',
            email: '',
            phone: '',
            availability: '',
            mmcNumber: '',
            mmcCertificate: '',
            image: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    // Filter doctors
    const filteredDoctors = doctors.filter((doc) => {
        const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSpec = !filterSpecialization || doc.specialization === filterSpecialization;
        return matchSearch && matchSpec;
    });

    const specializations = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))];

    if (loading) {
        return <div className="doctors-page"><div className="loading">Loading doctors...</div></div>;
    }

    return (
        <div className="doctors-page">
            <div className="page-header">
                <h1>👨‍⚕️ Doctors Directory</h1>
                <p className="page-subtitle">Manage hospital doctors and their credentials</p>
            </div>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Add/Edit Doctor Form */}
            <div className="form-section">
                <div className="form-header">
                    <h2>{editingId ? '✏️ Edit Doctor' : '➕ Add New Doctor'}</h2>
                    <button
                        className={`btn-toggle-form ${showForm ? 'active' : ''}`}
                        onClick={() => {
                            if (showForm) resetForm();
                            else setShowForm(true);
                        }}
                    >
                        {showForm ? '✕ Cancel' : '+ Add Doctor'}
                    </button>
                </div>

                {showForm && (
                    <form className="doctor-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Dr. John Doe"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Specialization *</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    placeholder="Cardiology"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="doctor@hospital.com"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91-9876543210"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Availability</label>
                                <input
                                    type="text"
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    placeholder="Mon-Fri 9AM-5PM"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>MMC Registration Number</label>
                                <input
                                    type="text"
                                    name="mmcNumber"
                                    value={formData.mmcNumber}
                                    onChange={handleInputChange}
                                    placeholder="MMC/XXXXX/XXXXX"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Doctor Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="form-input"
                                />
                                {formData.image && (
                                    <div className="preview-image">
                                        <img src={formData.image} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>MMC Certificate</label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={handleCertificateUpload}
                                    className="form-input"
                                />
                                {formData.mmcCertificate && (
                                    <div className="preview-badge">✓ Certificate uploaded</div>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update Doctor' : 'Add Doctor'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Search and Filter */}
            <div className="filter-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Search doctors by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="specialization-filter">
                    <select
                        value={filterSpecialization}
                        onChange={(e) => setFilterSpecialization(e.target.value)}
                        className="form-input"
                    >
                        <option value="">All Specializations</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                                {spec}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="results-count">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="doctors-grid">
                {filteredDoctors.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-icon">👨‍⚕️</p>
                        <p className="empty-text">No doctors found</p>
                        <p className="empty-subtext">Try adjusting your filters or add a new doctor</p>
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="doctor-card">
                            <div className="card-image-section">
                                {doctor.image ? (
                                    <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                                ) : (
                                    <div className="doctor-avatar">👨‍⚕️</div>
                                )}
                            </div>

                            <div className="card-content">
                                <h3 className="doctor-name">{doctor.name}</h3>
                                <p className="specialization">{doctor.specialization}</p>

                                {doctor.mmcNumber && (
                                    <div className="mmc-badge">
                                        <span className="badge-icon">📋</span>
                                        MMC: {doctor.mmcNumber}
                                    </div>
                                )}

                                <div className="contact-info">
                                    {doctor.phone && (
                                        <div className="info-item">
                                            <span className="info-icon">📱</span>
                                            <a href={`tel:${doctor.phone}`}>{doctor.phone}</a>
                                        </div>
                                    )}
                                    {doctor.email && (
                                        <div className="info-item">
                                            <span className="info-icon">📧</span>
                                            <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                                        </div>
                                    )}
                                </div>

                                {doctor.availability && (
                                    <div className="availability-info">
                                        <span className="info-icon">⏰</span>
                                        <span>{doctor.availability}</span>
                                    </div>
                                )}

                                {doctor.mmcCertificate && (
                                    <div className="certificate-badge">
                                        <span className="badge-icon">✓</span>
                                        Certificate on File
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                <button className="btn-edit" onClick={() => handleEdit(doctor)}>
                                    Edit
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(doctor.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorsPage;