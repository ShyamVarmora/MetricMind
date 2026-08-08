import { useState, useEffect } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import "./Dashboard.css";
import "./Reports.css";

function Reports() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
      setError(false);

      const res = await api.get(`/reports/${type}`);

      setReportData(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
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
            showSidebar={showSidebar}
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

            {reportData === null ? (
              <EmptyState
                title="No Report Selected"
                message="Select any report card above to preview the report."
              />
            ) : (
              <pre
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  overflow: "auto",
                  boxShadow: "0 6px 20px rgba(0,0,0,.08)",
                  color: "#111827",
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