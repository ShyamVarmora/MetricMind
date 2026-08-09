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

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    setTimeout(() => {
      setDashboardData({
        totalSales: 250000,
        orders: 180,
        profit: 65000,

        salesChange: "+12%",
        ordersChange: "+8%",
        profitChange: "+15%",

        chart: [
          { month: "Jan", sales: 4000 },
          { month: "Feb", sales: 5000 },
          { month: "Mar", sales: 6500 },
          { month: "Apr", sales: 6000 },
          { month: "May", sales: 7200 },
          { month: "Jun", sales: 8500 },
        ],

        transactions: [
          {
            id: 101,
            customer: "Rahul Sharma",
            amount: "₹5,000",
            status: "Completed",
          },
          {
            id: 102,
            customer: "Priya Singh",
            amount: "₹3,200",
            status: "Pending",
          },
          {
            id: 103,
            customer: "Aman Gupta",
            amount: "₹8,400",
            status: "Completed",
          },
          {
            id: 104,
            customer: "Neha Verma",
            amount: "₹2,700",
            status: "Cancelled",
          },
        ],
      });

      setLoading(false);
    }, 1200);
  };

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
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <>
        {/* TOP HEADER */}
        <Navbar />

        {/* MOBILE MENU */}
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
              closeSidebar={closeMobileSidebar}
            />
          )}

          {/* CONTENT */}
          <div className="dashboard-content">
            <Skeleton />
          </div>

        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // MAIN DASHBOARD
  // =========================

  return (
    <>
      {/* =========================
          TOP HEADER
      ========================= */}

      <Navbar />

      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      {window.innerWidth <= 768 && (
        <button
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}

      {/* =========================
          DASHBOARD LAYOUT
      ========================= */}

      <div className="dashboard">

        {/* =========================
            SIDEBAR
        ========================= */}

        {showSidebar && (
          <Sidebar
            showSidebar={showSidebar}
            closeSidebar={closeMobileSidebar}
          />
        )}

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="dashboard-content">

          {/* =========================
              WELCOME BANNER
          ========================= */}

          <div className="welcome-banner">
            <h1>Welcome to MetricMind 👋</h1>
            <p>
              Monitor your business from one dashboard.
            </p>
          </div>

          {/* =========================
              DASHBOARD CARDS
          ========================= */}

          <DashboardCard data={dashboardData} />

          {/* =========================
              SALES CHART
          ========================= */}

          <div className="dashboard-section">
            <ChartSection
              data={dashboardData.chart}
            />
          </div>

          {/* =========================
              RECENT TRANSACTIONS
          ========================= */}

          <div className="dashboard-section">
            <RecentTransactions
              transactions={dashboardData.transactions}
            />
          </div>

        </div>
      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <Footer />
    </>
  );
}

export default Dashboard;