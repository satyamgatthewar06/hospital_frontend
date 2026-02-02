import React, { useState, useEffect } from 'react';
import { fetchBillingRecords } from '../../services/billingService';

const BillingRecords = () => {
    const [billingRecords, setBillingRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBillingRecords = async () => {
            try {
                const records = await fetchBillingRecords();
                setBillingRecords(records);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getBillingRecords();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Billing Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {billingRecords.map((record) => (
                        <tr key={record.id}>
                            <td>{record.patientName}</td>
                            <td>{record.amount}</td>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BillingRecords;