import "./DashboardCard.css";

import {
  FaRupeeSign,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

const cards = [
  {
    id: 1,
    title: "Total Sales",
    value: "₹1,20,000",
    icon: <FaRupeeSign />,
    color: "linear-gradient(135deg,#2563EB,#1D4ED8)",
    change: "+12%",
  },
  {
    id: 2,
    title: "Orders",
    value: "150",
    icon: <FaShoppingCart />,
    color: "linear-gradient(135deg,#22C55E,#16A34A)",
    change: "+8%",
  },
  {
    id: 3,
    title: "Profit",
    value: "₹25,000",
    icon: <FaChartLine />,
    color: "linear-gradient(135deg,#F59E0B,#D97706)",
    change: "+15%",
  },
];

function DashboardCard() {
  return (
    <div className="cards">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card"
          style={{ background: card.color }}
        >
          <div className="card-header">
            <div className="card-icon">
              {card.icon}
            </div>

            <span className="card-change">
              {card.change}
            </span>
          </div>

          <h3>{card.title}</h3>

          <h1>{card.value}</h1>

          <p>Compared to last month</p>
        </div>
      ))}
    </div>
  );
import { useState, useEffect } from "react";
import api from "../api";

function DashboardCard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/dashboard")
            .then((res) => {
                setDashboard(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Unable to load dashboard");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
            }}
        >
            <div
                style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px",
                }}
            >
                <h3>Total Sales</h3>
                <h2>₹{dashboard.total_sales}</h2>
            </div>

            <div
                style={{
                    background: "#10b981",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px",
                }}
            >
                <h3>Orders</h3>
                <h2>{dashboard.total_orders}</h2>
            </div>

            <div
                style={{
                    background: "#f59e0b",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px",
                }}
            >
                <h3>Total Customers</h3>
                <h2>{dashboard.total_customers}</h2>
            </div>
        </div>
    );
}

export default DashboardCard;