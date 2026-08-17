import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Reports", path: "/reports" },
  { label: "Analytics", path: "/analytics" },
  { label: "Chat", path: "/chat" },
  { label: "Profile", path: "/profile" },
  { label: "Settings", path: "/settings" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unread, setUnread] = useState(3);
  const notificationRef = useRef(null);

  const notifications = [
    { id: 1, text: "New sales report is available", path: "/reports" },
    { id: 2, text: "Analytics dashboard is ready", path: "/analytics" },
    { id: 3, text: "Ask AI is available for business questions", path: "/chat" },
  ];

  useEffect(() => {
    const close = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = search.trim().toLowerCase();
    if (!value) return;
    const match = menuItems.find((item) => item.label.toLowerCase().includes(value));
    if (match) {
      navigate(match.path);
      setSearch("");
    }
  };

  const currentLabel = menuItems.find((item) => item.path === location.pathname)?.label || "MetricMind";

  return (
    <nav className="navbar">
      <button className="navbar-logo" onClick={() => navigate("/dashboard")} aria-label="Go to dashboard">
        MetricMind
      </button>

      <form className="navbar-center" onSubmit={submitSearch}>
        <input
          type="search"
          placeholder={`Search pages... (${currentLabel})`}
          className="navbar-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search pages"
        />
      </form>

      <div className="navbar-right" ref={notificationRef}>
        <button
          className="icon-btn notification-button"
          onClick={() => {
            setShowNotifications((value) => !value);
            setUnread(0);
          }}
          aria-label="Notifications"
          aria-expanded={showNotifications}
        >
          🔔
          {unread > 0 && <span className="notification-badge">{unread}</span>}
        </button>

        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-title-row">
              <h4>Notifications</h4>
              <button onClick={() => setUnread(0)}>Mark read</button>
            </div>
            {notifications.map((item) => (
              <button
                className="notification-item"
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setShowNotifications(false);
                }}
              >
                <span className="notification-dot" />
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
