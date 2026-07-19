function Sidebar() {
  return (
    <div
      style={{
        width: "200px",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h3>Menu</h3>

      <p>🏠 Dashboard</p>
      <p>📊 Analytics</p>
      <p>📄 Reports</p>
    </div>
  );
}

export default Sidebar;