import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); setOpen(false); navigate('/users'); };
  const link = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="brand">📚 LibraryMS</span>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <nav className={open ? 'nav-links open' : 'nav-links'} onClick={() => setOpen(false)}>
          {user && (
            <>
              <NavLink to="/" end className={link}>Dashboard</NavLink>
              <NavLink to="/books" className={link}>Book Management</NavLink>
              <NavLink to="/transactions" className={link}>Transactions</NavLink>
            </>
          )}
          <NavLink to="/users" className={link}>{user ? 'Users' : 'Login'}</NavLink>
          {user && (
            <button className="btn btn-light" onClick={handleLogout}>
              Logout ({user.name})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
