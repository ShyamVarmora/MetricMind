import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "./Dashboard.css";
import "./Analytics.css";

const salesData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1800 },
  { month: "Mar", sales: 5000, revenue: 3200 },
  { month: "Apr", sales: 4200, revenue: 2800 },
  { month: "May", sales: 6100, revenue: 4500 },
];

const customerData = [
  { name: "New", value: 55 },
  { name: "Returning", value: 45 },
];

const COLORS = ["#2563EB", "#22C55E"];

function Analytics() {
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth > 768
  );

  const [loading, setLoading] = useState(true);

  const [error] = useState(false);

  const [data] = useState(salesData);

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
  // LOADING
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // LOADING STATE
  // =========================

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
  // ERROR STATE
  // =========================

  if (error) {
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
              closeSidebar={() => {
                if (window.innerWidth <= 768) {
                  setShowSidebar(false);
                }
              }}
            />
          )}

          <div className="dashboard-content">
            <ErrorState message="Unable to load analytics data." />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================

  if (data.length === 0) {
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
              closeSidebar={() => {
                if (window.innerWidth <= 768) {
                  setShowSidebar(false);
                }
              }}
            />
          )}

          <div className="dashboard-content">
            <EmptyState
              title="No Analytics Data"
              message="Analytics data will appear here."
            />
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // MAIN ANALYTICS PAGE
  // =========================

  return (
    <>
      {/* TOP HEADER */}
      <Navbar />

      {/* MOBILE MENU BUTTON */}
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

        {/* MAIN CONTENT */}
        <div className="dashboard-content">

          {/* WELCOME BANNER */}
          <div className="welcome-banner">
            <h1>📊 Analytics Dashboard</h1>
            <p>Business Performance Overview</p>
          </div>

          {/* FILTER BAR */}
          <div className="analytics-topbar">

            <input
              type="date"
              aria-label="Select date"
            />

            <select defaultValue="All Categories">
              <option>All Categories</option>
              <option>Sales</option>
              <option>Revenue</option>
              <option>Customers</option>
              <option>Products</option>
            </select>

          </div>

          {/* STAT CARDS */}
          <div className="analytics-cards">

            <div className="analytics-stat-card">
              <h3>Total Sales</h3>
              <h1>₹1,25,000</h1>
            </div>

            <div className="analytics-stat-card">
              <h3>Revenue</h3>
              <h1>₹82,000</h1>
            </div>

            <div className="analytics-stat-card">
              <h3>Customers</h3>
              <h1>845</h1>
            </div>

            <div className="analytics-stat-card">
              <h3>Products</h3>
              <h1>230</h1>
            </div>

          </div>

          {/* CHARTS */}
          <div className="analytics-grid">

            {/* SALES */}
            <div className="analytics-card">
              <h2>Sales Chart</h2>

              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="sales"
                    name="Sales"
                    fill="#2563EB"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* REVENUE */}
            <div className="analytics-card">
              <h2>Revenue Chart</h2>

              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#22C55E"
                    strokeWidth={4}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* CUSTOMERS */}
            <div className="analytics-card">
              <h2>Customer Chart</h2>

              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <PieChart>

                  <Pie
                    data={customerData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {customerData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index]}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* PRODUCTS */}
            <div className="analytics-card">
              <h2>Product Chart</h2>

              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <BarChart data={salesData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="revenue"
                    name="Products"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Analytics;