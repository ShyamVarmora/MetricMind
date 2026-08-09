import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    "New sales report available",
    "Profile updated successfully",
    "3 new orders received",
  ];

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
      >
        MetricMind
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search menu..."
          className="navbar-search"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="navbar-right">
        <button
          className="icon-btn"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
        >
          🔔
        </button>

        {showNotifications && (
          <div className="notification-dropdown">
            <h4>Notifications</h4>

            {notifications.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;