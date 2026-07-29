import { useState, useEffect } from "react";
import api from "../api";

function DashboardCard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        api.get("/dashboard")
            .then((res) => {
                console.log(res.data);
                setDashboard(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
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
                marginBottom: "30px"
            }}
        >
            <div
                style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "180px"
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
                    width: "180px"
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
                    width: "180px"
                }}
            >
                <h3>Total Customers</h3>
                <h2>{dashboard.total_customers}</h2>
            </div>
        </div>
    );
import "./DashboardCard.css";
import { useState } from "react";

function DashboardCard() {
  const [hovered, setHovered] = useState("");

  const cardStyle = (bg, id) => ({
    background: bg,
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    flex: "1",
    minWidth: "220px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: hovered === id ? "translateY(-8px)" : "translateY(0)",
  });

  return (
    <div className="cards">
      <div
        className="card"
        onMouseEnter={() => setHovered("sales")}
        onMouseLeave={() => setHovered("")}
        style={cardStyle(
          "linear-gradient(135deg,#2563eb,#1d4ed8)",
          "sales"
        )}
      >
        <h3>💰 Total Sales</h3>
        <h1>₹1,20,000</h1>
      </div>

      <div
        className="card"
        onMouseEnter={() => setHovered("orders")}
        onMouseLeave={() => setHovered("")}
        style={cardStyle(
          "linear-gradient(135deg,#34d399,#10b981)",
          "orders"
        )}
      >
        <h3>🛒 Orders</h3>
        <h1>150</h1>
      </div>

      <div
        className="card"
        onMouseEnter={() => setHovered("profit")}
        onMouseLeave={() => setHovered("")}
        style={cardStyle(
          "linear-gradient(135deg,#fbbf24,#f59e0b)",
          "profit"
        )}
      >
        <h3>📈 Profit</h3>
        <h1>₹25,000</h1>
      </div>
    </div>
  );
}

export default DashboardCard;