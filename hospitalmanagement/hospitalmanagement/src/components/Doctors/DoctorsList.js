import React, { useEffect, useState } from 'react';
import {
    fetchDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
} from '../../services/doctorService';
import DoctorForm from './DoctorForm';
import DoctorDetails from './DoctorDetails';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('list'); // list, add, edit, details
    const [selected, setSelected] = useState(null);

    const load = async () => {
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

    useEffect(() => {
        load();
    }, []);

    const handleAdd = async (doc) => {
        const saved = await addDoctor(doc);
        await load();
        setMode('list');
        setSelected(null);
    };

    const handleUpdate = async (doc) => {
        await updateDoctor(doc.id, doc);
        await load();
        setMode('list');
        setSelected(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this doctor?')) return;
        await deleteDoctor(id);
        await load();
    };

    if (loading) return <div>Loading doctors...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="doctors-page">
            {mode === 'list' && (
                <div>
                    <div className="page-actions">
                        <h2>Doctors</h2>
                        <div>
                            <button onClick={() => { setMode('add'); setSelected(null); }}>➕ Add Doctor</button>
                        </div>
                    </div>

                    <table className="doctors-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.name}</td>
                                    <td>{d.specialization}</td>
                                    <td>{d.phone}</td>
                                    <td>{d.email}</td>
                                    <td>
                                        <button onClick={() => { setSelected(d); setMode('details'); }}>View</button>
                                        <button onClick={() => { setSelected(d); setMode('edit'); }}>Edit</button>
                                        <button onClick={() => handleDelete(d.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {mode === 'add' && (
                <div>
                    <h2>Add Doctor</h2>
                    <DoctorForm onSave={handleAdd} onCancel={() => setMode('list')} />
                </div>
            )}

            {mode === 'edit' && selected && (
                <div>
                    <h2>Edit Doctor</h2>
                    <DoctorForm doctor={selected} onSave={handleUpdate} onCancel={() => setMode('list')} />
                </div>
            )}

            {mode === 'details' && selected && (
                <DoctorDetails doctor={selected} onBack={() => setMode('list')} onEdit={(d) => { setSelected(d); setMode('edit'); }} />
            )}
        </div>
    );
};

export default DoctorsList;