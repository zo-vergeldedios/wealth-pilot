import { NavLink } from "react-router-dom";

// Left-hand navigation. NavLink automatically adds the "active" class
// to the link matching the current route.
export default function Sidebar() {
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

      <div className="sidebar-footer">Demo account</div>
    </aside>
  );
}
