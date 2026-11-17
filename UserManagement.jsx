import { useEffect, useState, useCallback } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';
import UserForm from '../components/UserForm.jsx';
import UserList from '../components/UserList.jsx';
import Message from '../components/Message.jsx';

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user?.role === 'admin';

  const load = useCallback(() => {
    api.getUsers().then(setUsers).catch((e) => setError(e.message));
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  if (!user) return <LoginForm />;

  if (!isAdmin) {
    return (
      <section>
        <h2>My Account</h2>
        <div className="card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Membership ID:</strong> {user.membership_id}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
        <Message type="warning">User management is available to administrators only.</Message>
      </section>
    );
  }

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await api.updateUser(editing.id, data);
        setSuccess('User updated.');
        setEditing(null);
      } else {
        await api.addUser(data);
        setSuccess('User added.');
      }
      setError('');
      load();
      return true;
    } catch (e) { setError(e.message); setSuccess(''); return false; }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"?`)) return;
    try { await api.deleteUser(u.id); setSuccess('User deleted.'); setError(''); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h2>User Management</h2>
      <Message>{error}</Message>
      <Message type="success">{success}</Message>
      <UserForm initialUser={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      <h3>All Users</h3>
      <UserList users={users} currentUserId={user.id}
                onUpdate={(u) => { setEditing(u); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onDelete={handleDelete} />
    </section>
  );
}
