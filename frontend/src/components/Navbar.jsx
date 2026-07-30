import "./Navbar.css";

function Navbar() {
  return (
    <nav
      className="navbar"
      style={{
        background: "#1E3A8A",
        color: "white",
        padding: "18px 35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          MetricMind
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
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

        <button
          style={{
            background: "#ffffff",
            color: "#1E3A8A",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Profile
        </button>
      </div>
    </nav>
  );
}

export default Navbar;