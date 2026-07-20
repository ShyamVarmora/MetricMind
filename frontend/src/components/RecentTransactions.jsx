function RecentTransactions() {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    background: "#2563eb",
    color: "white",
    padding: "12px",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  };

  return (
    <div
      style={{
        background: "white",
        marginTop: "30px",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        📋 Recent Transactions
      </h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdStyle}>#1001</td>
            <td style={tdStyle}>Rahul</td>
            <td style={tdStyle}>₹12,000</td>
            <td style={tdStyle}>✅ Completed</td>
          </tr>

          <tr>
            <td style={tdStyle}>#1002</td>
            <td style={tdStyle}>Priya</td>
            <td style={tdStyle}>₹8,500</td>
            <td style={tdStyle}>🟡 Pending</td>
          </tr>

          <tr>
            <td style={tdStyle}>#1003</td>
            <td style={tdStyle}>Aman</td>
            <td style={tdStyle}>₹15,200</td>
            <td style={tdStyle}>✅ Completed</td>
          </tr>

          <tr>
            <td style={tdStyle}>#1004</td>
            <td style={tdStyle}>Neha</td>
            <td style={tdStyle}>₹6,400</td>
            <td style={tdStyle}>❌ Cancelled</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RecentTransactions;