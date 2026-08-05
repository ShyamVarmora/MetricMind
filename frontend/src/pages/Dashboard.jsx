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
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <h1>Welcome to MetricMind 👋</h1>
            <p>Monitor your business from one dashboard.</p>
          </div>

          <div className="dashboard-cards">
            <DashboardCard data={dashboardData} />
          </div>

          <div className="dashboard-section">
            <ChartSection data={dashboardData.chart} />
          </div>

          <div className="dashboard-section">
            <RecentTransactions
              transactions={dashboardData.transactions}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;