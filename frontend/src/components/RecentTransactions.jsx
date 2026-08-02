import "./RecentTransactions.css";
import EmptyState from "./EmptyState";

function RecentTransactions({ transactions = [] }) {
  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <h2>📋 Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <EmptyState message="No recent transactions found." />
      ) : (
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
              {transactions.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.id || "-"}</td>

                  <td>{item.customer || item.customerName || "-"}</td>

                  <td>₹{item.amount ?? 0}</td>

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
                      {item.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;