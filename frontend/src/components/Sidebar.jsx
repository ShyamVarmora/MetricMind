import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const items = [
  ["📊", "Dashboard", "/dashboard"],
  ["📋", "Reports", "/reports"],
  ["💬", "Chat", "/chat"],
  ["📈", "Analytics", "/analytics"],
  ["👤", "Profile", "/profile"],
  ["⚙️", "Settings", "/settings"],
];

function Sidebar({ showSidebar, closeSidebar }) {
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(
    () => items.filter(([, label]) => label.toLowerCase().includes(search.trim().toLowerCase())),
    [search]
  );

  return (
    <aside className={`sidebar ${showSidebar ? "active" : ""}`}>
      <div className="sidebar-header">
        <h2>MetricMind</h2>
      </div>

      <input
        type="search"
        placeholder="🔍 Filter menu..."
        className="search-box"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Filter navigation"
      />

      <ul>
        {filteredItems.map(([icon, label, path]) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeSidebar}
            >
              {icon} {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {filteredItems.length === 0 && <div className="sidebar-no-results">No page found.</div>}

      <div className="sidebar-footer">MetricMind v1.0</div>
    </aside>
  );
}

export default Sidebar;
