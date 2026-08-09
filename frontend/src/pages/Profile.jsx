import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";
import ErrorState from "../components/ErrorState";

import "./Dashboard.css";
import "./Profile.css";

function Profile() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

      // Uncomment to test error placeholder
      // setError("Unable to load profile.");
    }, 1200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
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
            <h1>👤 Profile</h1>
            <p>Manage your profile information.</p>
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : !profile ? (
            <div className="empty-state">
              <h2>👤</h2>
              <h3>No profile found</h3>
              <p>Your profile information will appear here.</p>
            </div>
          ) : (
            <div className="profile-card">
              <label>Name</label>
              <input
                name="name"
                value={profile.name}
                disabled={!editing}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                name="email"
                value={profile.email}
                disabled={!editing}
                onChange={handleChange}
              />

              <label>Phone</label>
              <input
                name="phone"
                value={profile.phone}
                disabled={!editing}
                onChange={handleChange}
              />

              <label>Role</label>
              <input
                name="role"
                value={profile.role}
                disabled={!editing}
                onChange={handleChange}
              />

              <div className="profile-buttons">
                {!editing ? (
                  <button onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                ) : (
                  <button onClick={handleSave}>
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;