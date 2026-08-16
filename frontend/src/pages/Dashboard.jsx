import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import RecentTransactions from "../components/RecentTransactions";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";

import "./Dashboard.css";

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth > 768
  );

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DASHBOARD DATA FROM BACKEND
  // ==========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Get JWT token saved during login
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Dashboard request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Dashboard API response:", data);

      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESPONSIVE SIDEBAR
  // ==========================================

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE SIDEBAR
  // ==========================================

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        {window.innerWidth <= 768 && (
          <button
            className="menu-btn"
            onClick={() =>
              setShowSidebar(!showSidebar)
            }
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
            <Skeleton />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <>
        <Navbar />

        {window.innerWidth <= 768 && (
          <button
            className="menu-btn"
            onClick={() =>
              setShowSidebar(!showSidebar)
            }
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
            <div className="dashboard-error">
              <h2>Unable to load dashboard</h2>

              <p>{error}</p>

              <button
                onClick={fetchDashboard}
                className="retry-btn"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <>
      <Navbar />

      {/* MOBILE MENU BUTTON */}

      {window.innerWidth <= 768 && (
        <button
          className="menu-btn"
          onClick={() =>
            setShowSidebar(!showSidebar)
          }
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      {/* DASHBOARD LAYOUT */}

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

          {/* WELCOME BANNER */}

          <div className="welcome-banner">
            <h1>
              Welcome to MetricMind 👋
            </h1>

            <p>
              Monitor your business from one dashboard.
            </p>
          </div>

          {/* DASHBOARD CARDS */}

          <DashboardCard
            data={dashboardData}
          />

          {/* SALES CHART */}

          <div className="dashboard-section">
            <ChartSection
              data={
                dashboardData?.chart || []
              }
            />
          </div>

          {/* RECENT TRANSACTIONS */}

          <div className="dashboard-section">
            <RecentTransactions
              transactions={
                dashboardData?.transactions || []
              }
            />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;