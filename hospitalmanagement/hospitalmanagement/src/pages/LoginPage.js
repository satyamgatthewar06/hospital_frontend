import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@hospital.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'admin@hospital.com', password: 'admin123', role: 'Admin' },
    { email: 'doctor@hospital.com', password: 'doc123', role: 'Doctor' },
    { email: 'receptionist@hospital.com', password: 'rec123', role: 'Receptionist' },
    { email: 'accountant@hospital.com', password: 'acc123', role: 'Accountant' },
    { email: 'nurse@hospital.com', password: 'nurse123', role: 'Nurse' },
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>🏥 Hospital Management System</h1>
            <p>Secure Login</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? '🔄 Logging in...' : '🔐 Login'}
            </button>
          </form>

          <div className="demo-accounts">
            <h3>📝 Demo Accounts</h3>
            <div className="demo-grid">
              {demoAccounts.map((account, idx) => (
                <button
                  key={idx}
                  className="demo-btn"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  type="button"
                >
                  <span className="role-badge">{account.role}</span>
                  <span className="email-text">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="login-info">
            <h4>ℹ️ Role-Based Access:</h4>
            <ul>
              <li><strong>👨‍💻 Admin:</strong> Full system access, manage staff & users</li>
              <li><strong>👨‍⚕️ Doctor:</strong> View appointments & patient info</li>
              <li><strong>👩‍💼 Receptionist:</strong> View doctors & count appointments</li>
              <li><strong>📊 Accountant:</strong> View & manage billing</li>
              <li><strong>👩‍⚕️ Nurse:</strong> Manage wards & patient care</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
