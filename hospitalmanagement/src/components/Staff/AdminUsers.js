import React, { useState, useContext } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import '../../styles/AdminUsers.css';

const ROLES = ['admin', 'doctor', 'accountant', 'lab', 'nurse'];

function AdminUsers() {
  const { users = [], addUser = () => { }, updateUser = () => { } } = useContext(HospitalContext);
  const [form, setForm] = useState({ username: '', name: '', role: 'doctor', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.role || !form.password) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    addUser({ ...form });
    setMessage({ type: 'success', text: 'User added' });
    setForm({ username: '', name: '', role: 'doctor', password: '' });
    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <div className="admin-users card">
      <h2>Admin: Manage Users</h2>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <form className="admin-user-form" onSubmit={handleAdd}>
        <div className="form-row">
          <input name="username" value={form.username} onChange={handleChange} placeholder="username" />
          <input name="name" value={form.name} onChange={handleChange} placeholder="full name" />
        </div>
        <div className="form-row">
          <select name="role" value={form.role} onChange={handleChange}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="btn-submit" type="submit">Add User</button>
      </form>

      <div className="users-list">
        <h3>Existing Users</h3>
        <table>
          <thead>
            <tr><th>Username</th><th>Name</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
