import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Message from './Message.jsx';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ membership_id: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.membership_id.trim()) e.membership_id = 'Membership ID is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    setServerError('');
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      login(await api.login(form));
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card login-card" onSubmit={handleSubmit} noValidate>
      <h2>Login</h2>
      <Message>{serverError}</Message>
      <div className="form-group">
        <label htmlFor="membership_id">Membership ID</label>
        <input id="membership_id" name="membership_id" value={form.membership_id} onChange={handleChange}
               className={errors.membership_id ? 'invalid' : ''} autoComplete="username" />
        {errors.membership_id && <small className="error-text">{errors.membership_id}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
               className={errors.password ? 'invalid' : ''} autoComplete="current-password" />
        {errors.password && <small className="error-text">{errors.password}</small>}
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}
