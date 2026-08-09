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

  const [loading, setLoading] = useState(true);

  const [error] = useState(false);

  const [data] = useState(salesData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No Analytics Available"
        message="Analytics data will appear here after backend integration."
      />
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="welcome-banner">
            <h1>📊 Analytics Dashboard</h1>
            <p>Business Performance Overview</p>
          </div>

          <div className="analytics-topbar">

            <input type="date" />

            <select>
              <option>All Categories</option>
              <option>Sales</option>
              <option>Revenue</option>
              <option>Customers</option>
              <option>Products</option>
            </select>

          </div>

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

          <div className="analytics-grid">

            <div className="analytics-card">

              <h2>Sales Chart</h2>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>

            </div>

            <div className="analytics-card">

              <h2>Revenue Chart</h2>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    dataKey="revenue"
                    stroke="#22C55E"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>

            <div className="analytics-card">

              <h2>Customer Chart</h2>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={customerData}
                    dataKey="value"
                    outerRadius={80}
                  >
                    {customerData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="analytics-card">

              <h2>Product Chart</h2>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="revenue"
                    fill="#F59E0B"
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