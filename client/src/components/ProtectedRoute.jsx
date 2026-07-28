import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps any route that requires a logged-in user. If there is no active
// session, the visitor is redirected to the login page instead of seeing the
// app. This is the frontend half of data ownership: the UI is only reachable
// with a session, and the API independently enforces it for every request.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for the initial session check before deciding, so a logged-in user
  // refreshing the page isn't briefly bounced to /login.
  if (loading) return <p className="page-note">Loading…</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
