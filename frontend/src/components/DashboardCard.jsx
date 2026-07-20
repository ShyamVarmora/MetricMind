function DashboardCard() {
  const cardStyle = (bg) => ({
    background: bg,
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    width: "250px",
    height: "150px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const hoverIn = (e) => {
    e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
    e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.25)";
  };

  const hoverOut = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "space-between",
        marginBottom: "30px",
      }}
    >
      <div
        style={cardStyle("linear-gradient(135deg,#2563eb,#1d4ed8)")}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        <h3>💰 Total Sales</h3>
        <h1>₹1,20,000</h1>
      </div>

      <div
        style={cardStyle("linear-gradient(135deg,#34d399,#10b981)")}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        <h3>🛒 Orders</h3>
        <h1>150</h1>
      </div>

      <div
        style={cardStyle("linear-gradient(135deg,#fbbf24,#f59e0b)")}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        <h3>📈 Profit</h3>
        <h1>₹25,000</h1>
      </div>
    </div>
  );
}

export default DashboardCard;