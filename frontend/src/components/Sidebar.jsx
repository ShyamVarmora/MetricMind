import "./Sidebar.css";

import {
  FaChartPie,
  FaFileAlt,
  FaComments,
  FaChartLine,
  FaUser,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    { icon: <FaChartPie />, label: "Dashboard" },
    { icon: <FaFileAlt />, label: "Reports" },
    { icon: <FaComments />, label: "Chat" },
    { icon: <FaChartLine />, label: "Analytics" },
    { icon: <FaUser />, label: "Profile" },
    { icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <h2>MetricMind</h2>

      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`menu-item ${index === 0 ? "active" : ""}`}
        >
          <span className="menu-icon">
            {item.icon}
          </span>

          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;