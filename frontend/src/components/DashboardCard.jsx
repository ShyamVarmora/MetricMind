import "./DashboardCard.css";
import {
  FaRupeeSign,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function DashboardCard({ data }) {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      title: "Total Sales",
      value: `₹${data?.totalSales ?? 0}`,
      icon: <FaRupeeSign />,
      color: "linear-gradient(135deg,#2563EB,#1D4ED8)",
      change: data?.salesChange ?? "+0%",
      route: "/reports",
    },
    {
      id: 2,
      title: "Orders",
      value: data?.orders ?? 0,
      icon: <FaShoppingCart />,
      color: "linear-gradient(135deg,#22C55E,#16A34A)",
      change: data?.ordersChange ?? "+0%",
      route: "/reports",
    },
    {
      id: 3,
      title: "Profit",
      value: `₹${data?.profit ?? 0}`,
      icon: <FaChartLine />,
      color: "linear-gradient(135deg,#F59E0B,#D97706)",
      change: data?.profitChange ?? "+0%",
      route: "/reports",
    },
  ];

  return (
    <div className="cards">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card"
          style={{
            background: card.color,
            cursor: "pointer",
          }}
          onClick={() => navigate(card.route)}
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
}

export default DashboardCard;