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

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadReport = async (type) => {
    try {
      setLoading(true);
      setError(false);
      setReportData(null);
      setSelectedReport(type);

      const response = await api.get(`/api/reports/${type}`);

      console.log("Report response:", response.data);

      setReportData(response.data);
    } catch (err) {
      console.error("Report API error:", err);

      setError(true);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const retryReport = () => {
    if (selectedReport) {
      loadReport(selectedReport);
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
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
              closeSidebar={closeSidebar}
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
            closeSidebar={closeSidebar}
          />
        )}

        <div className="dashboard-content">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="welcome-banner">
            <h1>📋 Reports</h1>
            <p>Business Reports Overview</p>
          </div>

          {/* =========================
              REPORT CARDS
          ========================= */}

          <div className="reports-grid">

            <div
              className={`report-card ${
                selectedReport === "sales"
                  ? "active-report"
                  : ""
              }`}
              onClick={() => loadReport("sales")}
            >
              <h2>Sales Report</h2>
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
              <h2>Revenue Report</h2>
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
              <h2>Customer Report</h2>
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
              <h2>Monthly Report</h2>
              <p>Monthly Business Analysis</p>
            </div>

          </div>

          {/* =========================
              ERROR STATE
          ========================= */}

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
                  Unable to load the report data.
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

          {/* =========================
              REPORT RESULT
          ========================= */}

          {!error && (
            <div className="report-result">

              {reportData === null ? (

                <EmptyState
                  title="No Report Selected"
                  message="Select any report card above to preview the report."
                />

              ) : (

                <div className="report-output">

                  {/* HEADER */}

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

                  {/* =========================
                      SALES REPORT
                  ========================= */}

                  {selectedReport === "sales" &&
                    reportData.data && (
                      <div className="report-stats">

                        <div className="stat-box">
                          <h4>Total Orders</h4>
                          <strong>
                            {reportData.data.total_orders}
                          </strong>
                        </div>

                        <div className="stat-box">
                          <h4>Total Sales</h4>
                          <strong>
                            ₹
                            {Number(
                              reportData.data.total_sales || 0
                            ).toLocaleString()}
                          </strong>
                        </div>

                        <div className="stat-box">
                          <h4>Average Order Value</h4>
                          <strong>
                            ₹
                            {Number(
                              reportData.data.average_order_value || 0
                            ).toLocaleString()}
                          </strong>
                        </div>

                      </div>
                    )}

                  {/* =========================
                      REVENUE REPORT
                  ========================= */}

                  {selectedReport === "revenue" &&
                    reportData.data && (
                      <div className="report-stats">

                        <div className="stat-box">
                          <h4>Total Revenue</h4>
                          <strong>
                            ₹
                            {Number(
                              reportData.data.total_revenue || 0
                            ).toLocaleString()}
                          </strong>
                        </div>

                        <div className="stat-box">
                          <h4>Average Revenue</h4>
                          <strong>
                            ₹
                            {Number(
                              reportData.data.average_revenue || 0
                            ).toLocaleString()}
                          </strong>
                        </div>

                      </div>
                    )}

                  {/* =========================
                      CUSTOMER REPORT
                  ========================= */}

                  {selectedReport === "customer" &&
                    reportData.data && (
                      <div className="report-stats">

                        <div className="stat-box">
                          <h4>Total Customers</h4>
                          <strong>
                            {reportData.data.total_customers}
                          </strong>
                        </div>

                        <div className="stat-box">
                          <h4>Total Orders</h4>
                          <strong>
                            {reportData.data.total_orders}
                          </strong>
                        </div>

                        <div className="stat-box">
                          <h4>Average Order Value</h4>
                          <strong>
                            ₹
                            {Number(
                              reportData.data.average_order_value || 0
                            ).toLocaleString()}
                          </strong>
                        </div>

                      </div>
                    )}

                  {/* =========================
                      MONTHLY REPORT
                  ========================= */}

                  {selectedReport === "monthly" &&
                    Array.isArray(reportData.data) && (
                      <div className="monthly-table">

                        <table>

                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>Orders</th>
                              <th>Sales</th>
                            </tr>
                          </thead>

                          <tbody>

                            {reportData.data.length > 0 ? (

                              reportData.data.map((item) => (
                                <tr key={item.month}>

                                  <td>
                                    {item.month}
                                  </td>

                                  <td>
                                    {item.orders}
                                  </td>

                                  <td>
                                    ₹
                                    {Number(
                                      item.sales || 0
                                    ).toLocaleString()}
                                  </td>

                                </tr>
                              ))

                            ) : (

                              <tr>
                                <td colSpan="3">
                                  No monthly data available.
                                </td>
                              </tr>

                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

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