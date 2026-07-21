import { useState } from "react";
import "./Sidebar.css";

function Sidebar() {
  const [hovered, setHovered] = useState("");

  const menuItems = [
    { icon: "📊", label: "Analytics" },
    { icon: "📁", label: "Reports" },
    { icon: "💬", label: "Chatbot" },
    { icon: "👤", label: "Profile" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <h2
        style={{
          textAlign: "center",
          color: "#60A5FA",
          marginBottom: "35px",
        }}
      >
        Dashboard
      </h2>

      {menuItems.map((item) => (
        <div
          key={item.label}
          onMouseEnter={() => setHovered(item.label)}
          onMouseLeave={() => setHovered("")}
          style={{
            padding: "14px 18px",
            marginBottom: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all .3s",
            background:
              item.label === "Analytics"
                ? "#2563EB"
                : hovered === item.label
                ? "#334155"
                : "transparent",
            transform:
              hovered === item.label
                ? "translateX(6px)"
                : "translateX(0)",
            fontWeight:
              item.label === "Analytics" ? "600" : "500",
          }}
        >
          {item.icon} {item.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;