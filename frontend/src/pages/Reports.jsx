import { useState, useEffect } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

import "./Dashboard.css";
import "./Reports.css";

function Reports() {
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth > 768
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================
  // LOAD REPORT
  // =========================

  const loadReport = async (type) => {
    try {
      setLoading(true);
      setError(false);
      setReportData(null);
      setSelectedReport(type);

      console.log("Loading report:", type);

      // IMPORTANT:
      // Backend route is /reports/{type}
      const response = await api.get(`/reports/${type}`);

      console.log("Report response:", response.data);

      setReportData(response.data);
    } catch (err) {
      console.error("Report API error:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
      }

      setError(true);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RETRY
  // =========================

  const retryReport = () => {
    if (selectedReport) {
      loadReport(selectedReport);
    }
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
            <LoadingState />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

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

        {/* SIDEBAR */}

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

        {/* CONTENT */}

        <div className="dashboard-content">

          {/* HEADER */}

          <div className="welcome-banner">
            <h1>📋 Reports</h1>
            <p>Business Reports Overview</p>
          </div>

          {/* REPORT CARDS */}

          <div className="reports-grid">

            <div
              className={`report-card ${
                selectedReport === "sales"
                  ? "active-report"
                  : ""
              }`}
              onClick={() => loadReport("sales")}
            >
              <h2>📊 Sales Report</h2>
              <p>Total Sales Performance</p>
            </div>

            <div
              className={`report-card ${
                selectedReport === "revenue"
                  ? "active-report"
                  : ""
              }`}
              onClick={() => loadReport("revenue")}
            >
              <h2>💰 Revenue Report</h2>
              <p>Revenue Growth Analysis</p>
            </div>

            <div
              className={`report-card ${
                selectedReport === "customer"
                  ? "active-report"
                  : ""
              }`}
              onClick={() => loadReport("customer")}
            >
              <h2>👥 Customer Report</h2>
              <p>Customer Insights</p>
            </div>

            <div
              className={`report-card ${
                selectedReport === "monthly"
                  ? "active-report"
                  : ""
              }`}
              onClick={() => loadReport("monthly")}
            >
              <h2>📅 Monthly Report</h2>
              <p>Monthly Business Analysis</p>
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="reports-state">
              <div className="error-card">

                <div className="error-icon">
                  ⚠️
                </div>

                <h2>
                  Something went wrong
                </h2>

                <p>
                  Unable to load the report.
                  Please try again.
                </p>

                <button
                  className="retry-btn"
                  onClick={retryReport}
                >
                  Try Again
                </button>

              </div>
            </div>
          )}

          {/* RESULT */}

          {!error && (
            <div className="report-result">

              {reportData === null ? (

                <EmptyState
                  title="No Report Selected"
                  message="Select any report card above to preview the report."
                />

              ) : (

                <div className="report-output">

                  <div className="report-output-header">

                    <div>
                      <h3>📊 Report Result</h3>

                      <p>
                        {selectedReport
                          ? `${selectedReport
                              .charAt(0)
                              .toUpperCase()}${selectedReport.slice(
                              1
                            )} Report`
                          : "Report"}
                      </p>
                    </div>

                  </div>

                  <pre>
                    {JSON.stringify(
                      reportData,
                      null,
                      2
                    )}
                  </pre>

                </div>

              )}

            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Reports;