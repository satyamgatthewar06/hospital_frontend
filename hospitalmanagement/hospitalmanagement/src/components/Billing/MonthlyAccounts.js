import React, { useEffect, useState } from 'react';
import { fetchMonthlyAccounts } from '../../services/billingService';

const MonthlyAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMonthlyAccounts = async () => {
            try {
                const data = await fetchMonthlyAccounts();
                setAccounts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMonthlyAccounts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Monthly Accounts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total Revenue</th>
                        <th>Total Patients</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.month}>
                            <td>{account.month}</td>
                            <td>{account.totalRevenue}</td>
                            <td>{account.totalPatients}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MonthlyAccounts;