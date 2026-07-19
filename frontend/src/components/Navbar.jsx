function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>MetricMind</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <span>Dashboard</span>
        <span>Analytics</span>
        <span>Reports</span>
      </div>
    </nav>
  );
}

export default Navbar;