import React, { useState, useContext } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { HospitalContext } from '../context/HospitalContext';
import '../styles/AccountantPage.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AccountantPage() {
  const { billings } = useContext(HospitalContext);

  const [formData, setFormData] = useState({
    patientName: '',
    amount: '',
    paymentMode: 'Cash',
    date: new Date().toISOString().split('T')[0],
    billNo: ''
  });

  const [payments, setPayments] = useState([
    { id: 1, patientName: 'John Doe', amount: 5000, paymentMode: 'Cash', date: '2025-01-27', billNo: 'BILL001' },
    { id: 2, patientName: 'Jane Smith', amount: 8500, paymentMode: 'UPI', date: '2025-01-26', billNo: 'BILL002' },
    { id: 3, patientName: 'Robert Wilson', amount: 85000, paymentMode: 'Cash', date: '2025-01-20', billNo: 'BILL003' },
    { id: 4, patientName: 'Sarah Lee', amount: 62000, paymentMode: 'UPI', date: '2025-01-25', billNo: 'BILL004' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: payments.length + 1,
      ...formData,
      amount: parseFloat(formData.amount)
    };
    setPayments([...payments, newPayment]);
    setFormData({
      patientName: '',
      amount: '',
      paymentMode: 'Cash',
      date: new Date().toISOString().split('T')[0],
      billNo: ''
    });
  };

  // Calculate statistics
  const cashPayments = payments.filter(p => p.paymentMode === 'Cash');
  const upiPayments = payments.filter(p => p.paymentMode === 'UPI');
  const totalCash = cashPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalUPI = upiPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRevenue = totalCash + totalUPI;

  // Pie chart data
  const paymentModeData = {
    labels: ['Cash', 'UPI'],
    datasets: [
      {
        label: 'Payment Mode Distribution',
        data: [cashPayments.length, upiPayments.length],
        backgroundColor: ['#667eea', '#764ba2'],
        borderColor: ['#5568d3', '#6a3f97'],
        borderWidth: 2
      }
    ]
  };

  // Revenue pie chart
  const revenueData = {
    labels: ['Cash Revenue', 'UPI Revenue'],
    datasets: [
      {
        label: 'Revenue by Mode (₹)',
        data: [totalCash, totalUPI],
        backgroundColor: ['#f59e0b', '#10b981'],
        borderColor: ['#d97706', '#059669'],
        borderWidth: 2
      }
    ]
  };

  // Line chart for daily revenue
  const dailyRevenue = payments.reduce((acc, payment) => {
    const existing = acc.find(item => item.date === payment.date);
    if (existing) {
      existing.amount += payment.amount;
    } else {
      acc.push({ date: payment.date, amount: payment.amount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  const lineChartData = {
    labels: dailyRevenue.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: dailyRevenue.map(item => item.amount),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">💰 Accountant Dashboard</h2>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="stat-card cash">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <p className="stat-label">Cash Payments</p>
            <p className="stat-value">₹{totalCash.toLocaleString('en-IN')}</p>
            <p className="stat-count">{cashPayments.length} transactions</p>
          </div>
        </div>

        <div className="stat-card upi">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <p className="stat-label">UPI Payments</p>
            <p className="stat-value">₹{totalUPI.toLocaleString('en-IN')}</p>
            <p className="stat-count">{upiPayments.length} transactions</p>
          </div>
        </div>

        <div className="stat-card transactions">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Transactions</p>
            <p className="stat-value">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3 className="chart-title">Payment Mode Distribution</h3>
          <Pie data={paymentModeData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Revenue by Payment Mode</h3>
          <Pie data={revenueData} options={chartOptions} />
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="full-width-chart">
        <h3 className="chart-title">Daily Revenue Trend</h3>
        <Line data={lineChartData} options={{ ...chartOptions, maintainAspectRatio: false }} height={300} />
      </div>

      {/* Add Payment Form */}
      <div className="form-container">
        <h3>Add Payment Record</h3>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-row">
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Mode</label>
              <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Bill No</label>
              <input
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={handleChange}
                placeholder="Enter bill number"
                required
              />
            </div>
            <div className="form-group-button">
              <button type="submit" className="btn btn-primary">Add Payment</button>
            </div>
          </div>
        </form>
      </div>

      {/* Payment Records Table */}
      <div className="table-container">
        <h3 className="table-title">Payment Records</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Patient Name</th>
              <th>Amount (₹)</th>
              <th>Payment Mode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td className="bill-number">{payment.billNo}</td>
                <td>{payment.patientName}</td>
                <td className="amount">₹{payment.amount.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${payment.paymentMode.toLowerCase()}`}>
                    {payment.paymentMode}
                  </span>
                </td>
                <td>{new Date(payment.date).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountantPage;