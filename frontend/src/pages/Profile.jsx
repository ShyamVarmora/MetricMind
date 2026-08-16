import { useState, useEffect } from "react";
import api from "../api";

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
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    created_at: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    loadProfile();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile");

      console.log("Profile response:", response.data);

      const data = response.data?.data || response.data;

      setProfile({
        name: data.name || "",
        email: data.email || "",
        created_at: data.created_at || "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);

      setError("Unable to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.put("/profile", {
        name: profile.name,
      });

      console.log("Profile update response:", response.data);

      setEditing(false);
      setMessage("Profile updated successfully!");

      await loadProfile();
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    setError("");

    loadProfile();
  };

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

          <div className="welcome-banner">
            <h1>👤 Profile</h1>
            <p>Manage your profile information.</p>
          </div>

          {error && (
            <div className="error-card">
              <div className="error-icon">⚠️</div>

              <p>{error}</p>

              <button onClick={loadProfile}>
                Try Again
              </button>
            </div>
          )}

          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}

          <div className="profile-card">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              disabled={!editing || saving}
              onChange={handleChange}
            />

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              disabled
            />

            <label htmlFor="created_at">
              Account Created
            </label>

            <input
              id="created_at"
              type="text"
              value={
                profile.created_at
                  ? new Date(
                      profile.created_at
                    ).toLocaleString()
                  : "Not available"
              }
              disabled
            />

            <div className="profile-buttons">

              {!editing ? (
                <button
                  onClick={() => {
                    setEditing(true);
                    setMessage("");
                  }}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </>
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