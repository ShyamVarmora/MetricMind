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
    console.log("Searching:", e.target.value);
  };

  return (
    <nav className="navbar">

      <div
        className="navbar-left"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <h2>MetricMind</h2>
      </div>

      <div className="navbar-center">
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search menu..."
          className="search-box"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div
        className="navbar-right"
        style={{ position: "relative" }}
      >

        <button
          className="icon-btn"
          onClick={() =>
            setShowNotifications(!showNotifications)
          }
        >
          🔔
        </button>

        {showNotifications && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50px",
              width: "250px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,.15)",
              padding: "10px",
              zIndex: 999,
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>
              Notifications
            </h4>

            {notifications.map((item, index) => (
              <p
                key={index}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                }}
              >
                {item}
              </p>
            ))}
          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;