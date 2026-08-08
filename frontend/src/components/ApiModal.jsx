import "./ApiModal.css";

function ApiModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>API Details</h2>

        <div className="modal-section">
          <h4>Endpoint</h4>

          <code>
            GET /api/reports/sales
          </code>
        </div>

        <div className="modal-section">
          <h4>Request</h4>

          <pre>
{`{
  "month":"June"
}`}
          </pre>
        </div>

        <div className="modal-section">
          <h4>Response</h4>

          <pre>
{`{
  "totalSales":250000,
  "orders":180,
  "profit":65000
}`}
          </pre>
        </div>

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

export default ApiModal;