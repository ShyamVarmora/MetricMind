import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "./Dashboard.css";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth > 768
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================
  // THEME
  // =========================

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <>
      {/* TOP HEADER */}

      <Navbar />

      {/* MOBILE MENU */}

      {window.innerWidth <= 768 && (
        <button
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      <div className="dashboard">

        {/* SIDEBAR */}

        {showSidebar && (
          <Sidebar
            showSidebar={showSidebar}
            closeSidebar={closeMobileSidebar}
          />
        )}

        {/* MAIN CONTENT */}

        <div className="dashboard-content">

          <div className="welcome-banner">
            <h1>⚙️ Settings</h1>
            <p>
              Manage your application settings.
            </p>
          </div>

          <div className="settings-grid">

            {/* ACCOUNT */}

            <div className="setting-card">

              <h2>👤 Account</h2>

              <p>
                Manage your profile information.
              </p>

              <button
                onClick={() => {
                  closeMobileSidebar();
                  navigate("/profile");
                }}
              >
                Manage
              </button>

            </div>

            {/* NOTIFICATIONS */}

            <div className="setting-card">

              <h2>🔔 Notifications</h2>

              <p>
                Configure your notification preferences.
              </p>

              <button
                onClick={() =>
                  alert(
                    "Notification settings coming soon."
                  )
                }
              >
                Configure
              </button>

            </div>

            {/* THEME */}

            <div className="setting-card">

              <h2>🌙 Theme</h2>

              <p>
                Change the application appearance.
              </p>

              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
              >
                {darkMode
                  ? "Light Mode"
                  : "Dark Mode"}
              </button>

            </div>

            {/* LOGOUT */}

            <div className="setting-card">

              <h2>🚪 Logout</h2>

              <p>
                Sign out from your MetricMind account.
              </p>

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