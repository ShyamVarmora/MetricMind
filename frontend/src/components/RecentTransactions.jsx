import "./RecentTransactions.css";

function RecentTransactions() {
  const transactions = [
    { id: 1, customer: "Rahul", amount: "₹12,000", status: "Completed" },
    { id: 2, customer: "Anjali", amount: "₹8,500", status: "Pending" },
    { id: 3, customer: "Aman", amount: "₹15,000", status: "Completed" },
    { id: 4, customer: "Priya", amount: "₹5,200", status: "Cancelled" },
  ];

  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <h2>📋 Recent Transactions</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.customer}</td>
                <td>{item.amount}</td>

                <td>
                  <span
                    className={`status ${
                      item.status === "Completed"
                        ? "completed"
                        : item.status === "Pending"
                        ? "pending"
                        : "cancelled"
                    }`}
                  >
                    {item.status}
                  </span>
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