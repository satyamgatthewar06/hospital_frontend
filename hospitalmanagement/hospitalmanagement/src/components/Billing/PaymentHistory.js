import React, { useState, useEffect } from 'react';
import razorpayService from '../../services/razorpayService';
import '../styles/PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = () => {
    const paymentsList = razorpayService.getPaymentHistory();
    const ordersList = JSON.parse(localStorage.getItem('razorpay_orders') || '[]');
    
    setPayments(paymentsList);
    setOrders(ordersList);
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === 'all') return true;
    return payment.status === filterStatus;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'amount':
        return (b.amount || 0) - (a.amount || 0);
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      default:
        return 0;
    }
  });

  const calculateStats = () => {
    const stats = {
      totalTransactions: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      successfulPayments: payments.filter(p => p.status === 'success').length,
      failedPayments: payments.filter(p => p.status === 'failed').length,
    };
    return stats;
  };

  const stats = calculateStats();

  const downloadPaymentReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Payment ID,Bill ID,Amount,Status,Date & Time\n';
    
    payments.forEach(payment => {
      const row = [
        payment.id,
        payment.billId,
        `₹${payment.amount || 0}`,
        payment.status,
        new Date(payment.timestamp).toLocaleString(),
      ];
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payment-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="payment-history-container">
      <h2>💳 Payment History & Analytics</h2>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>Total Transactions</h4>
            <p className="stat-value">{stats.totalTransactions}</p>
          </div>
        </div>

        <div className="stat-card amount">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h4>Total Amount</h4>
            <p className="stat-value">₹{stats.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h4>Successful</h4>
            <p className="stat-value">{stats.successfulPayments}</p>
          </div>
        </div>

        <div className="stat-card failed">
          <div className="stat-icon">✕</div>
          <div className="stat-content">
            <h4>Failed</h4>
            <p className="stat-value">{stats.failedPayments}</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="payment-controls">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Latest First</option>
            <option value="amount">Amount (High to Low)</option>
            <option value="status">Status</option>
          </select>
        </div>

        <button className="download-btn" onClick={downloadPaymentReport}>
          📥 Download Report
        </button>
      </div>

      {/* Payment Table */}
      <div className="payment-table-container">
        <h3>Recent Transactions</h3>
        
        {sortedPayments.length === 0 ? (
          <div className="empty-state">
            <p>💔 No payment records found</p>
          </div>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Bill ID</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((payment) => (
                <tr key={payment.id} className={`status-${payment.status}`}>
                  <td className="payment-id">
                    <code>{payment.id}</code>
                  </td>
                  <td>{payment.billId}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status === 'success' && '✓ Success'}
                      {payment.status === 'failed' && '✕ Failed'}
                      {payment.status === 'pending' && '⏳ Pending'}
                    </span>
                  </td>
                  <td className="amount">₹{(payment.amount || 0).toFixed(2)}</td>
                  <td className="timestamp">
                    {new Date(payment.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <button className="details-btn" 
                      onClick={() => alert(`Payment ID: ${payment.id}\nStatus: ${payment.status}\nDate: ${new Date(payment.timestamp).toLocaleString()}`)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Summary */}
      <div className="orders-section">
        <h3>Orders Summary</h3>
        {orders.length === 0 ? (
          <p className="no-data">No orders found</p>
        ) : (
          <div className="orders-grid">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>{order.id}</h4>
                  <span className={`order-status ${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="order-details">
                  <p><span>Amount:</span> ₹{(order.amount / 100).toFixed(2)}</p>
                  <p><span>Bill:</span> {order.notes?.billId}</p>
                  <p><span>Patient:</span> {order.notes?.patientName}</p>
                  <p><span>Created:</span> {new Date(order.created_at * 1000).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
