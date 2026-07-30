import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardBanner from "../components/DashboardBanner";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import RecentTransactions from "../components/RecentTransactions";
import Footer from "../components/Footer";

import "./Dashboard.css";

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar />

      <button
        className="menu-btn"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        ☰
      </button>

      <div className="dashboard">

        {(window.innerWidth > 768 || showSidebar) && (
          <Sidebar />
        )}

        <div className="dashboard-content">

          <DashboardBanner />

          <div className="dashboard-cards">
            <DashboardCard />
          </div>

          <div className="dashboard-section">
            <ChartSection />
          </div>

          <div className="dashboard-section">
            <RecentTransactions />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;