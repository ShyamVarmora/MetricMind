import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ closeSidebar }) {
  const handleClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className="sidebar">
      <h2>MetricMind</h2>

      <input
        type="text"
        placeholder="🔍 Search..."
        className="search-box"
      />

      <ul>
        <li>
          <NavLink
            to="/"
            end
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
          <a href="#" onClick={handleClick}>
            💬 Chat
          </a>
        </li>

        <li>
          <a href="#" onClick={handleClick}>
            📈 Analytics
          </a>
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
    </div>
  );
}

export default Sidebar;