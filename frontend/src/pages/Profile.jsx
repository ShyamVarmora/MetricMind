import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import "./Profile.css";

function Profile() {
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
            <h1>👤 Profile</h1>
            <p>Manage your profile information.</p>
          </div>

          <div className="profile-card">

            <label>Name</label>

            <input
              type="text"
              defaultValue="Yoshita"
            />

            <label>Email</label>

            <input
              type="email"
              defaultValue="yoshita@email.com"
            />

            <div className="profile-buttons">
              <button>Edit</button>
              <button>Save</button>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;