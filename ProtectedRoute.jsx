import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Sends visitors to the login page (on /users) if nobody is signed in.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/users" replace />;
}
