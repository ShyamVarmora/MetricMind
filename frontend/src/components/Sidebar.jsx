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
function Sidebar({ setActivePage }) {
    return (
        <div
            style={{
                width: "220px",
                background: "#1e293b",
                color: "white",
                padding: "20px",
                minHeight: "500px"
            }}
        >
            <h3>Dashboard</h3>

            <p
                style={{ cursor: "pointer" }}
                onClick={() => setActivePage("dashboard")}
            >
                📊 Analytics
            </p>

            <p>📁 Reports</p>

            <p
                style={{ cursor: "pointer" }}
                onClick={() => setActivePage("chat")}
            >
                🤖 Ask MetricMind
            </p>

            <p>⚙ Settings</p>
        </div>
    );
}

export default Sidebar;

