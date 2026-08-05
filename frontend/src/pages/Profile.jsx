import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";

import "./Dashboard.css";
import "./Profile.css";

function Profile() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Yoshita Chaudhary",
    email: "yoshita@email.com",
    phone: "+91 9876543210",
    role: "UI Developer",
  });

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

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="dashboard">
          {showSidebar && <Sidebar />}

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
            <h1>👤 Profile</h1>
            <p>Manage your profile information.</p>
          </div>

          <div className="profile-card">

            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={profile.name}
              disabled={!editing}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={profile.email}
              disabled={!editing}
              onChange={handleChange}
            />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={profile.phone}
              disabled={!editing}
              onChange={handleChange}
            />

            <label htmlFor="role">Role</label>
            <input
              id="role"
              name="role"
              value={profile.role}
              disabled={!editing}
              onChange={handleChange}
            />

            <div className="profile-buttons">
              {!editing ? (
                <button onClick={() => setEditing(true)}>
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