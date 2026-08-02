import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "./Dashboard.css";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <>
      <Navbar />

      {window.innerWidth <= 768 && (
        <button
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>
      )}

      <div className="dashboard">

        {showSidebar && (
          <Sidebar
            closeSidebar={() => {
              if (window.innerWidth <= 768) {
                setShowSidebar(false);
              }
            }}
          />
        )}

        <div className="dashboard-content">

          <div className="welcome-banner">
            <h1>⚙️ Settings</h1>
            <p>Manage your application settings.</p>
          </div>

          <div className="settings-grid">

            <div className="setting-card">
              <h2>👤 Account</h2>

              <button onClick={() => navigate("/profile")}>
                Manage
              </button>
            </div>

            <div className="setting-card">
              <h2>🔔 Notifications</h2>

              <button
                onClick={() =>
                  alert("Notification settings coming soon.")
                }
              >
                Configure
              </button>
            </div>

            <div className="setting-card">
              <h2>🌙 Theme</h2>

              <button
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>

            <div className="setting-card">
              <h2>🚪 Logout</h2>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Settings;