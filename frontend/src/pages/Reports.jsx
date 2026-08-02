import { useState, useEffect } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

import "./Dashboard.css";
import "./Reports.css";

function Reports() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
              style={{ cursor: "pointer" }}
            >
              <h2>Sales Report</h2>
              <p>Total Sales Performance</p>
            </div>

            <div
              className="report-card"
              onClick={() => loadReport("revenue")}
              style={{ cursor: "pointer" }}
            >
              <h2>Revenue Report</h2>
              <p>Revenue Growth Analysis</p>
            </div>

            <div
              className="report-card"
              onClick={() => loadReport("customer")}
              style={{ cursor: "pointer" }}
            >
              <h2>Customer Report</h2>
              <p>Customer Insights</p>
            </div>

            <div
              className="report-card"
              onClick={() => loadReport("monthly")}
              style={{ cursor: "pointer" }}
            >
              <h2>Monthly Report</h2>
              <p>Monthly Business Analysis</p>
            </div>

          </div>

          <div style={{ marginTop: "30px" }}>

            {loading && <Loading />}

            {!loading && error && (
              <ErrorState message={error} />
            )}

            {!loading && !error && reportData === null && (
              <EmptyState message="Select a report to view." />
            )}

            {!loading && !error && reportData && (
              <pre
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  overflow: "auto",
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