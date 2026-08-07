import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    "New sales report available",
    "Profile updated successfully",
    "3 new orders received",
  ];

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={handleLogoClick}>
        <h2>MetricMind</h2>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search menu..."
          className="search-box"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="navbar-right">
        <button
          className="icon-btn"
          onClick={() => setShowNotifications(!showNotifications)}
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