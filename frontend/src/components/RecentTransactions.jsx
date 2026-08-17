import "./RecentTransactions.css";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function RecentTransactions({ transactions = [] }) {
  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <div><h2>📋 Recent Transactions</h2><p>Latest sales recorded in the database</p></div>
      </div>
      {transactions.length === 0 ? (
        <div className="transactions-empty">No recent transactions found.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {transactions.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.customer_name || "Unknown customer"}</td>
                  <td>{formatMoney(item.sales_amount)}</td>
                  <td>{formatDate(item.order_date)}</td>
                  <td><span className="status completed">{item.status || "Recorded"}</span></td>
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
