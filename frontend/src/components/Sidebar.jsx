import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ showSidebar, closeSidebar }) {
  const handleClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <aside className={`sidebar ${showSidebar ? "active" : ""}`}>
      <div className="sidebar-header">
        <h2>MetricMind</h2>
      </div>

      <input
        type="text"
        placeholder="🔍 Search..."
        className="search-box"
      />

      <ul>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleClick}
          >
            📊 Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleClick}
          >
            📋 Reports
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleClick}
          >
            💬 Chat
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/analytics"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleClick}
          >
            📈 Analytics
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleClick}
          >
            👤 Profile
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleClick}
          >
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        MetricMind v1.0
      </div>
    </aside>
  );
}

export default Sidebar;