import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import "./Settings.css";

function Settings() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              if (window.innerWidth <= 768) setShowSidebar(false);
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
              <button>Manage</button>
            </div>

            <div className="setting-card">
              <h2>🔔 Notifications</h2>
              <button>Configure</button>
            </div>

            <div className="setting-card">
              <h2>🌙 Theme</h2>
              <button>Change</button>
            </div>

            <div className="setting-card">
              <h2>🚪 Logout</h2>
              <button>Logout</button>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Settings;