import "./SqlModal.css";

function SqlModal({ open, onClose, sql = "" }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <h2>SQL Transparency</h2>
        <p>The chat layer does not generate SQL. Database queries remain inside the trusted backend data service.</p>
        <pre>{sql || "No SQL trace was returned."}</pre>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SqlModal;
