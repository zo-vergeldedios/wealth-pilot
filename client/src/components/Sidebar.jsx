import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Left-hand navigation. NavLink automatically adds the "active" class
// to the link matching the current route.
export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Clear the session, then send the user to the login page.
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">🧭</span>
        <span className="sidebar-name">WealthPilot</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/expenses" className="nav-link">
          Expenses
        </NavLink>
        <NavLink to="/income" className="nav-link">
          Income
        </NavLink>
        <NavLink to="/goals" className="nav-link">
          Goals
        </NavLink>
      </nav>

      {/* Shows who is signed in and lets them log out. */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-label">Signed in as</span>
          <span className="sidebar-user-name">{user?.username}</span>
        </div>
        <button className="btn btn-secondary sidebar-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
