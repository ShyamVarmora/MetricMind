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