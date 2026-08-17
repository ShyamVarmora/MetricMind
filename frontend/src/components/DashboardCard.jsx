import "./DashboardCard.css";
import { FaRupeeSign, FaShoppingCart, FaChartLine } from "react-icons/fa";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function DashboardCard({ data = {} }) {
  const cards = [
    {
      id: 1,
      title: "Total Sales",
      value: money(data.total_sales),
      icon: <FaRupeeSign />,
      color: "linear-gradient(135deg,#2563EB,#1D4ED8)",
      change: data.salesChange ?? "0%",
    },
    {
      id: 2,
      title: "Orders",
      value: Number(data.orders || 0).toLocaleString("en-IN"),
      icon: <FaShoppingCart />,
      color: "linear-gradient(135deg,#22C55E,#16A34A)",
      change: data.ordersChange ?? "0%",
    },
    {
      id: 3,
      title: "Profit",
      value: money(data.profit),
      icon: <FaChartLine />,
      color: "linear-gradient(135deg,#F59E0B,#D97706)",
      change: data.profitChange ?? "0%",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.id} className="card" style={{ background: card.color }}>
          <div className="card-top">
            {card.icon}
            <span className="card-change">{card.change}</span>
          </div>
          <h3>{card.title}</h3>
          <h1>{card.value}</h1>
          <p>Current database total</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardCard;
