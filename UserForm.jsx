import { useState, useEffect } from 'react';

const EMPTY = { name: '', membership_id: '', role: 'member', password: '' };

export default function UserForm({ initialUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const editing = Boolean(initialUser);

  useEffect(() => {
    setForm(initialUser ? { ...initialUser, password: '' } : EMPTY);
    setErrors({});
  }, [initialUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.membership_id.trim()) e.membership_id = 'Membership ID is required';
    if ((!editing || form.password) && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    const ok = await onSubmit(form);
    if (ok && !editing) setForm(EMPTY);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h3 className="full">{editing ? 'Update User' : 'Add New User'}</h3>
      <div className="form-group">
        <label htmlFor="u-name">Name</label>
        <input id="u-name" name="name" value={form.name} onChange={handleChange} className={errors.name ? 'invalid' : ''} />
        {errors.name && <small className="error-text">{errors.name}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="u-mid">Membership ID</label>
        <input id="u-mid" name="membership_id" value={form.membership_id} onChange={handleChange}
               className={errors.membership_id ? 'invalid' : ''} />
        {errors.membership_id && <small className="error-text">{errors.membership_id}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="u-role">Role</label>
        <select id="u-role" name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="u-pass">{editing ? 'New Password (optional)' : 'Password'}</label>
        <input id="u-pass" name="password" type="password" value={form.password} onChange={handleChange}
               className={errors.password ? 'invalid' : ''} autoComplete="new-password" />
        {errors.password && <small className="error-text">{errors.password}</small>}
      </div>
      <div className="form-actions full">
        <button className="btn btn-primary" type="submit">{editing ? 'Save Changes' : 'Add User'}</button>
        {editing && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
