import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { HospitalContext } from '../context/HospitalContext';
import './Adminlogin.css';

const AdminLogin = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { login, demoLogin, isAuthenticated, currentUser } = useContext(HospitalContext);

	const [role, setRole] = useState('ADMIN'); // Default role

	// Auto-login on mount if already authenticated
	useEffect(() => {
		if (isAuthenticated && currentUser) {
			if (currentUser.role === 'ADMIN') {
				history.push('/admin-dashboard');
			} else if (currentUser.role === 'DOCTOR') {
				history.push('/doctors');
			} else {
				history.push('/');
			}
		}
	}, [isAuthenticated, currentUser, history]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			// Try to login via API
			const user = await login(username, password);
			console.log('Login successful:', user);

			// Normalize roles for comparison
			const contentRole = user.role ? user.role.toUpperCase() : '';
			const selectedRole = role.toUpperCase();

			// Check if the user has the selected role
			// Note: If user.role is array, this needs adjustment. standard seems to be string.
			if (contentRole !== selectedRole) {
				setError(`Access Denied: You are logged in as ${user.role}, but selected ${role}.`);
				setLoading(false);
				return;
			}

			setLoading(false);

			// Redirect based on role
			switch (contentRole) {
				case 'ADMIN':
					history.push('/admin-dashboard');
					break;
				case 'DOCTOR':
					history.push('/doctors');
					break;
				case 'NURSE':
				case 'RECEPTIONIST':
				case 'ACCOUNTANT':
				case 'LABORATORY':
				case 'PHARMACIST':
				default:
					history.push('/'); // Default dashboard
					break;
			}

		} catch (err) {
			setLoading(false);
			// Fallback to default credentials for demo/development
			// Note: This only works for ADMIN in this specific block, but can be expanded
			if (username === 'admin' && password === 'admin123' && role === 'ADMIN') {
				console.log('Using fallback demo credentials');

				// Manually set auth state for demo
				demoLogin(role);

				setLoading(true);
				setTimeout(() => {
					setLoading(false);
					history.push('/admin-dashboard');
				}, 800);
			} else {
				setError(err.response?.data?.message || 'Invalid username or password');
				console.error('Login error:', err);
			}
		}
	};

	const handleForgot = () => {
		alert('Please contact administrator to reset your password.');
	};

	return (
		<div className="admin-login-wrapper">
			<form className="admin-login-form" onSubmit={handleSubmit}>
				<h2>Admin Login</h2>
				{error && <div className="login-error">{error}</div>}

				<label>Role</label>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					disabled={loading}
					className="login-input"
				>
					<option value="ADMIN">Admin</option>
					<option value="DOCTOR">Doctor</option>
					<option value="NURSE">Nurse</option>
					<option value="RECEPTIONIST">Receptionist</option>
					<option value="ACCOUNTANT">Accountant</option>
					<option value="LABORATORY">Laboratory</option>
					<option value="PHARMACIST">Pharmacist</option>
				</select>

				<label>Username</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					placeholder="Enter username"
					disabled={loading}
				/>

				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					placeholder="Enter password"
					disabled={loading}
				/>

				<div className="login-actions">
					<button type="submit" className="btn-primary" disabled={loading}>
						{loading ? 'Logging in...' : 'Login'}
					</button>
					<button type="button" className="btn-link" onClick={handleForgot} disabled={loading}>
						Forgot Password
					</button>
				</div>

				<div className="demo-credentials">
					<small>Demo: admin / admin123</small>
				</div>
			</form>
		</div>
	);
};

export default AdminLogin;
