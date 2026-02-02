import React, { useState, useEffect } from 'react';
import { getOPDPatientCount } from '../../services/patientService';

const OPDDashboard = () => {
    const [opdCount, setOpdCount] = useState(0);

    useEffect(() => {
        const fetchOPDCount = async () => {
            const count = await getOPDPatientCount();
            setOpdCount(count);
        };

        fetchOPDCount();
    }, []);

    return (
        <div className="opd-dashboard">
            <h2>Outpatient Department Dashboard</h2>
            <p>Total OPD Patients: {opdCount}</p>
        </div>
    );
};

export default OPDDashboard;