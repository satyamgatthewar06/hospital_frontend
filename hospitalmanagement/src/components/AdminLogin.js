import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { HospitalContext } from '../context/HospitalContext';
import './Adminlogin.css';

const AdminLogin = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { login, demoLogin, isAuthenticated, currentUser } = useContext(HospitalContext);

	const [role, setRole] = useState('ADMIN'); // Default role

	// Auto-login on mount if already authenticated
	useEffect(() => {
		if (isAuthenticated && currentUser) {
			const userRole = currentUser.role?.toLowerCase();
			if (userRole === 'admin') {
				history.push('/admin-dashboard');
			} else if (userRole === 'doctor') {
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

			// Normalize roles for comparison (both to lowercase)
			const contentRole = user.role ? user.role.toLowerCase() : '';
			const selectedRole = role.toLowerCase();

			// Check if the user has the selected role
			if (contentRole !== selectedRole) {
				setError(`Access Denied: You are logged in as ${user.role}, but selected ${role}.`);
				setLoading(false);
				return;
			}

			setLoading(false);

			// Redirect based on role (all lowercase after normalization)
			switch (contentRole) {
				case 'admin':
					history.push('/admin-dashboard');
					break;
				case 'doctor':
					history.push('/doctors');
					break;
				case 'nurse':
				case 'receptionist':
				case 'accountant':
				case 'laboratory':
				case 'pharmacist':
				default:
					history.push('/'); // Default dashboard
					break;
			}

		} catch (err) {
			setLoading(false);
			// Fallback to default credentials for demo/development
			const demoCredentials = {
				admin: { user: 'admin', pass: 'admin123', redirect: '/admin-dashboard' },
				doctor: { user: 'doctor', pass: 'doctor123', redirect: '/doctors' },
				nurse: { user: 'nurse', pass: 'nurse123', redirect: '/' },
				receptionist: { user: 'receptionist', pass: 'recep123', redirect: '/' },
				accountant: { user: 'accountant', pass: 'account123', redirect: '/comprehensive-billing' },
				laboratory: { user: 'lab', pass: 'lab123', redirect: '/laboratory' },
			};

			const selectedRole = role.toLowerCase();
			const demoCred = demoCredentials[selectedRole];

			if (demoCred && username === demoCred.user && password === demoCred.pass) {
				console.log('Using fallback demo credentials for role:', selectedRole);

				// Manually set auth state for demo
				demoLogin(role);

				setLoading(true);
				setTimeout(() => {
					setLoading(false);
					history.push(demoCred.redirect);
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
				<div className="password-input-wrapper">
					<input
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						placeholder="Enter password"
						disabled={loading}
					/>
					<button
						type="button"
						className="password-toggle-btn"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>

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
