function DashboardBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#2563EB,#4F46E5)",
        color: "#fff",
        padding: "30px",
        borderRadius: "20px",
        marginBottom: "30px",
        boxShadow: "0 12px 30px rgba(37,99,235,.25)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        Welcome to MetricMind 👋
      </h2>

      <p
        style={{
          marginTop: "12px",
          fontSize: "16px",
          opacity: "0.9",
        }}
      >
        Monitor your sales, orders, analytics and business performance from one
        dashboard.
      </p>
    </div>
  );
}

export default DashboardBanner;