function RecentTransactions() {
  const transactions = [
    { id: 1, customer: "Rahul", amount: "₹12,000", status: "Completed" },
    { id: 2, customer: "Anjali", amount: "₹8,500", status: "Pending" },
    { id: 3, customer: "Aman", amount: "₹15,000", status: "Completed" },
    { id: 4, customer: "Priya", amount: "₹5,200", status: "Cancelled" },
  ];

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#fff",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#1E293B",
        }}
      >
        📋 Recent Transactions
      </h2>

      {/* Responsive Table */}
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ background: "#2563EB", color: "white" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Customer</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr
                key={item.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: "12px" }}>{item.id}</td>
                <td style={{ padding: "12px" }}>{item.customer}</td>
                <td style={{ padding: "12px" }}>{item.amount}</td>
                <td
                  style={{
                    padding: "12px",
                    color:
                      item.status === "Completed"
                        ? "green"
                        : item.status === "Pending"
                        ? "orange"
                        : "red",
                    fontWeight: "600",
                  }}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactions;