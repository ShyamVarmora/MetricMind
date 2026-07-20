function Navbar() {
  return (
    <nav
      style={{
        background: "#1E3A8A",
        color: "white",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "26px",
          fontWeight: "700",
        }}
      >
        MetricMind
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "17px",
            fontWeight: "500",
          }}
        >
          Welcome, User 👤
        </span>

        <span
          style={{
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          🔔
        </span>

        <button
          onMouseEnter={(e) => {
            e.target.style.background = "#2563EB";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#1E3A8A";
          }}
          style={{
            background: "white",
            color: "#1E3A8A",
            border: "none",
            padding: "9px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.3s",
          }}
        >
          Profile
        </button>
      </div>
    </nav>
  );
}

export default Navbar;