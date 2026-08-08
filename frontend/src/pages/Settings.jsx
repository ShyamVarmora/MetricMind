import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";
import ErrorState from "../components/ErrorState";

import "./Dashboard.css";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setLoading(false);

      // Uncomment to test error placeholder
      // setError("Unable to load settings.");
    }, 1200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
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

  if (loading) {
    return (
      <>
        <div className="dashboard">
          <Sidebar
            showSidebar={showSidebar}
            closeSidebar={() => setShowSidebar(false)}
          />

          <div className="dashboard-content">
            <Skeleton />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      {window.innerWidth <= 768 && (
        <button
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>
      )}

      <div className="dashboard">
        <Sidebar
          showSidebar={showSidebar}
          closeSidebar={() => {
            if (window.innerWidth <= 768) {
              setShowSidebar(false);
            }
          }}
        />

        <div className="dashboard-content">
          <div className="welcome-banner">
            <h1>⚙️ Settings</h1>
            <p>Manage your application settings.</p>
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : (
            <div className="settings-grid">

              <div className="setting-card">
                <h2>👤 Account</h2>
                <p>Manage your profile information.</p>

                <button onClick={() => navigate("/profile")}>
                  Manage
                </button>
              </div>

              <div className="setting-card">
                <h2>🔔 Notifications</h2>
                <p>Notification preferences.</p>

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
                <p>Switch between Light and Dark mode.</p>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              <div className="setting-card">
                <h2>🚪 Logout</h2>
                <p>Sign out from MetricMind.</p>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Settings;