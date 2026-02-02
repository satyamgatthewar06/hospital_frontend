import React, { useEffect, useState } from 'react';
import { fetchYearlyAccounts } from '../../services/billingService';

const YearlyAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getYearlyAccounts = async () => {
            try {
                const data = await fetchYearlyAccounts();
                setAccounts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getYearlyAccounts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Yearly Accounts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Total Revenue</th>
                        <th>Total Expenses</th>
                        <th>Net Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.year}>
                            <td>{account.year}</td>
                            <td>{account.totalRevenue}</td>
                            <td>{account.totalExpenses}</td>
                            <td>{account.netProfit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default YearlyAccounts;