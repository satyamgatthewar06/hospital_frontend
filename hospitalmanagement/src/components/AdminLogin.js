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
	const { login, isAuthenticated, currentUser } = useContext(HospitalContext);

	// Auto-login on mount if already authenticated
	useEffect(() => {
		if (isAuthenticated && currentUser) {
			history.push('/');
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
			setLoading(false);

			// Redirect based on role
			if (user.role === 'DOCTOR') {
				history.push('/doctor-dashboard');
			} else if (user.role === 'ADMIN') {
				history.push('/admin-dashboard');
			} else {
				history.push('/');
			}
		} catch (err) {
			setLoading(false);
			// Fallback to default credentials for demo/development
			if (username === 'admin' && password === 'admin123') {
				console.log('Using fallback demo credentials');
				setLoading(true);
				setTimeout(() => {
					setLoading(false);
					history.push('/');
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
