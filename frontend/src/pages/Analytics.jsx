import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "./Dashboard.css";
import "./Analytics.css";

const categories = ["All Categories", "Sales", "Revenue", "Customers", "Products"];
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function Analytics() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [category, setCategory] = useState("All Categories");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { category };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await api.get("/analytics/overview", { params });
      if (!response.data?.success) throw new Error(response.data?.message || "Analytics request failed.");
      setData(response.data.data || null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      setData(null);
      setError(err.response?.data?.detail || err.message || "Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [category, startDate, endDate, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const series = data?.series || [];
  const chartKey = category === "Customers" ? "customers" : category === "Products" ? "products" : "sales";
  const topProducts = useMemo(() => data?.products || [], [data]);
  const breakdown = data?.breakdown || [];

  const closeSidebar = () => {
    if (window.innerWidth <= 768) setShowSidebar(false);
  };

  const clearFilters = () => {
    setCategory("All Categories");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <Navbar />
      {window.innerWidth <= 768 && <button className="menu-btn" onClick={() => setShowSidebar(!showSidebar)} aria-label="Toggle sidebar">☰</button>}
      <div className="dashboard">
        {showSidebar && <Sidebar showSidebar={showSidebar} closeSidebar={closeSidebar} />}
        <div className="dashboard-content">
          <div className="welcome-banner">
            <h1>📊 Analytics Dashboard</h1>
            <p>Filter the real database by date range and category.</p>
          </div>

          <div className="analytics-topbar">
            <label>From <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
            <label>To <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
            <label>Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button className="retry-btn" onClick={clearFilters}>Clear Filters</button>
          </div>

          {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadData} /> : !data ? <ErrorState message="No analytics data is available." onRetry={loadData} /> : (
            <>
              <div className="analytics-cards">
                <div className="analytics-stat-card"><h3>Total Sales</h3><h1>{money(data.total_sales)}</h1></div>
                <div className="analytics-stat-card"><h3>Orders</h3><h1>{Number(data.total_orders || 0).toLocaleString("en-IN")}</h1></div>
                <div className="analytics-stat-card"><h3>Customers</h3><h1>{Number(data.total_customers || 0).toLocaleString("en-IN")}</h1></div>
                <div className="analytics-stat-card"><h3>Products</h3><h1>{Number(data.total_products || 0).toLocaleString("en-IN")}</h1></div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h2>{category === "Customers" ? "Customers by Month" : category === "Products" ? "Products by Month" : "Sales by Month"}</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={series}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={chartKey} name={category === "Customers" ? "Customers" : category === "Products" ? "Products" : "Sales"} stroke="#2563EB" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                  <h2>Top Products</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={topProducts.slice(0, 8)} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="product" width={130} />
                      <Tooltip />
                      <Bar dataKey="sales" name="Sales" fill="#2563EB" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="analytics-card analytics-breakdown-card">
                <div className="analytics-breakdown-header">
                  <div><h2>{data.breakdown_title || "Category Breakdown"}</h2><p>Results use the selected date range and category.</p></div>
                  <span className="analytics-filter-summary">{startDate || "Earliest"} → {endDate || "Latest"}</span>
                </div>
                {breakdown.length === 0 ? <p className="analytics-empty">No matching records were found.</p> : (
                  <div className="analytics-breakdown-table-wrap">
                    <table className="analytics-breakdown-table">
                      <thead><tr><th>#</th><th>Name</th><th>Value</th></tr></thead>
                      <tbody>{breakdown.map((item, index) => <tr key={`${item.label}-${index}`}><td>{index + 1}</td><td>{item.label}</td><td>{category === "Customers" ? Number(item.value).toLocaleString("en-IN") : money(item.value)}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Analytics;
