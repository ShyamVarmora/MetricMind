import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import LoadingState from "../components/LoadingState";

import "./Dashboard.css";
import "./Profile.css";

function Profile() {
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth > 768
  );

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Yoshita Chaudhary",
    email: "yoshita@email.com",
    phone: "+91 9876543210",
    role: "UI Developer",
  });

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = () => {
    setEditing(false);

    alert("Profile updated successfully!");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

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

          {showSidebar && (
            <Sidebar
              showSidebar={showSidebar}
              closeSidebar={closeMobileSidebar}
            />
          )}

          <div className="dashboard-content">
            <LoadingState />
          </div>

        </div>

        <Footer />
      </>
    );
  }

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
            <h1>👤 Profile</h1>
            <p>
              Manage your profile information.
            </p>
          </div>

          <div className="profile-card">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              value={profile.name}
              disabled={!editing}
              onChange={handleChange}
            />

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              value={profile.email}
              disabled={!editing}
              onChange={handleChange}
            />

            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              value={profile.phone}
              disabled={!editing}
              onChange={handleChange}
            />

            <label htmlFor="role">
              Role
            </label>

            <input
              id="role"
              name="role"
              value={profile.role}
              disabled={!editing}
              onChange={handleChange}
            />

            <div className="profile-buttons">

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <button onClick={handleSave}>
                  Save
                </button>
              )}

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;