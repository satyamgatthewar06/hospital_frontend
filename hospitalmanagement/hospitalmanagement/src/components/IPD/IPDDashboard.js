import React, { useEffect, useState } from 'react';
import { getIPDPatientCount } from '../../services/patientService';

const IPDDashboard = () => {
    const [ipdCount, setIpdCount] = useState(0);

    useEffect(() => {
        const fetchIPDCount = async () => {
            const count = await getIPDPatientCount();
            setIpdCount(count);
        };

        fetchIPDCount();
    }, []);

    return (
        <div className="ipd-dashboard">
            <h2>Inpatient Department Dashboard</h2>
            <p>Total IPD Patients: {ipdCount}</p>
        </div>
    );
};

export default IPDDashboard;