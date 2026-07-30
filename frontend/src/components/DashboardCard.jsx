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
}

export default DashboardCard;