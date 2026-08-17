import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notifications") !== "off"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) setShowSidebar(false);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((enabled) => {
      const next = !enabled;
      localStorage.setItem("notifications", next ? "on" : "off");
      setMessage(next ? "Notifications enabled." : "Notifications disabled.");
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar />
      {window.innerWidth <= 768 && (
        <button className="menu-btn" onClick={() => setShowSidebar(!showSidebar)} aria-label="Toggle sidebar">☰</button>
      )}
      <div className="dashboard">
        {showSidebar && <Sidebar showSidebar={showSidebar} closeSidebar={closeMobileSidebar} />}
        <div className="dashboard-content">
          <div className="welcome-banner">
            <h1>⚙️ Settings</h1>
            <p>Manage appearance, notifications and your account.</p>
          </div>

          {message && <div className="success-message">{message}<button onClick={() => setMessage("")}>×</button></div>}

          <div className="settings-grid">
            <div className="setting-card">
              <h2>👤 Account</h2>
              <p>Manage your profile information.</p>
              <button onClick={() => navigate("/profile")}>Manage Profile</button>
            </div>

            <div className="setting-card">
              <h2>🔔 Notifications</h2>
              <p>Control whether application notifications are enabled.</p>
              <button onClick={toggleNotifications}>
                {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
              </button>
              <p className="theme-status">Status: <strong>{notificationsEnabled ? "On" : "Off"}</strong></p>
            </div>

            <div className="setting-card">
              <h2>🌙 Theme</h2>
              <p>Switch the entire application between light and dark mode.</p>
              <button onClick={() => setDarkMode((value) => !value)}>
                {darkMode ? "☀️ Use Light Mode" : "🌙 Use Dark Mode"}
              </button>
              <p className="theme-status">Current theme: <strong>{darkMode ? "Dark" : "Light"}</strong></p>
            </div>

            <div className="setting-card">
              <h2>🚪 Logout</h2>
              <p>Sign out from your MetricMind account.</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Settings;
