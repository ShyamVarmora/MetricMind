import { useState, useEffect } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import ErrorState from "../components/ErrorState";
import Skeleton from "../components/Skeleton";

import "./Dashboard.css";
import "./Reports.css";

function Reports() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);

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

  const loadReport = async (type) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/reports/${type}`);

      setReportData(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load report.");
      setReportData(null);
    } finally {
      setLoading(false);
    }
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
            <h1>📋 Reports</h1>
            <p>Business Reports Overview</p>
          </div>

          <div className="reports-grid">

            <div
              className="report-card"
              onClick={() => loadReport("sales")}
            >
              <h2>Sales Report</h2>
              <p>Total Sales Performance</p>
            </div>

            <div
              className="report-card"
              onClick={() => loadReport("revenue")}
            >
              <h2>Revenue Report</h2>
              <p>Revenue Growth Analysis</p>
            </div>

            <div
              className="report-card"
              onClick={() => loadReport("customer")}
            >
              <h2>Customer Report</h2>
              <p>Customer Insights</p>
            </div>

            <div
              className="report-card"
              onClick={() => loadReport("monthly")}
            >
              <h2>Monthly Report</h2>
              <p>Monthly Business Analysis</p>
            </div>

          </div>

          <div style={{ marginTop: "30px" }}>

            {error && (
              <ErrorState message={error} />
            )}

            {!error && reportData === null && (
              <div className="empty-state">
                <h2>📋</h2>
                <h3>Report will appear here</h3>
                <p>Select any report card to view report details.</p>
              </div>
            )}

            {!error && reportData && (
              <pre
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  overflow: "auto",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                }}
              >
                {JSON.stringify(reportData, null, 2)}
              </pre>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
export default Reports;