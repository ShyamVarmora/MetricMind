import "./SqlModal.css";

function SqlModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>SQL Query</h2>

        <pre>
{`SELECT
    month,
    SUM(total_sales) AS total_sales,
    SUM(profit) AS profit,
    COUNT(order_id) AS orders
FROM sales
GROUP BY month
ORDER BY month;`}
        </pre>

        <button
          className="close-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  );
}

export default SqlModal;