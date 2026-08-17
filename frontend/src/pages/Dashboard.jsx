import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartSection from "../components/ChartSection";
import RecentTransactions from "../components/RecentTransactions";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/dashboard");
      if (!response.data?.success) throw new Error("Dashboard data was not returned.");
      setDashboardData(response.data.data || null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      setError(err.response?.data?.detail || err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) setShowSidebar(false);
  };

  const shell = (content) => (
    <>
      <Navbar />
      {window.innerWidth <= 768 && (
        <button className="menu-btn" onClick={() => setShowSidebar(!showSidebar)} aria-label="Toggle sidebar">☰</button>
      )}
      <div className="dashboard">
        {showSidebar && <Sidebar showSidebar={showSidebar} closeSidebar={closeMobileSidebar} />}
        <div className="dashboard-content">{content}</div>
      </div>
      <Footer />
    </>
  );

  if (loading) return shell(<Skeleton />);

  if (error) {
    return shell(
      <div className="dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboard} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return shell(
    <>
      <div className="welcome-banner">
        <h1>Welcome to MetricMind 👋</h1>
        <p>Monitor your business from one dashboard.</p>
      </div>
      <DashboardCard data={dashboardData || {}} />
      <div className="dashboard-section">
        <ChartSection data={dashboardData?.chart || []} />
      </div>
      <div className="dashboard-section">
        <RecentTransactions transactions={dashboardData?.transactions || []} />
      </div>
    </>
  );
}

export default Dashboard;
