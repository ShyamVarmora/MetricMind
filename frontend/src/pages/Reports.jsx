import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import "./Reports.css";

function Reports() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              if (window.innerWidth <= 768) setShowSidebar(false);
            }}
          />
        )}

        <div className="dashboard-content">

          <div className="welcome-banner">
            <h1>📋 Reports</h1>
            <p>Business Reports Overview</p>
          </div>

          <div className="reports-grid">

            <div className="report-card">
              <h2>Sales Report</h2>
              <p>Total Sales Performance</p>
            </div>

            <div className="report-card">
              <h2>Revenue Report</h2>
              <p>Revenue Growth Analysis</p>
            </div>

            <div className="report-card">
              <h2>Customer Report</h2>
              <p>Customer Insights</p>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Reports;