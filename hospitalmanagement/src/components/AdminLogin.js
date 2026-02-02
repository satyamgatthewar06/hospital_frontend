import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Adminlogin.css';

const AdminLogin = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const history = useHistory();

	// Auto-login on mount
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			history.push('/');
		}, 500);
	}, [history]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError('');
		// simple mock authentication
		if (username === 'admin' && password === 'admin123') {
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
				history.push('/');
			}, 800);
		} else {
			setError('Invalid username or password');
		}
	};

	const handleForgot = () => {
		// simple placeholder behaviour
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
				/>

				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					placeholder="Enter password"
				/>

				<div className="login-actions">
					<button type="submit" className="btn-primary" disabled={loading}>
						{loading ? 'Logging in...' : 'Login'}
					</button>
					<button type="button" className="btn-link" onClick={handleForgot}>
						Forgot Password
					</button>
				</div>
			</form>
		</div>
	);
};

export default AdminLogin;
