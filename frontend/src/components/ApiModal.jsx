import "./ApiModal.css";

function ApiModal({ open, onClose, trace = [] }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <h2>API Trace</h2>
        {trace.length === 0 ? (
          <p>No API trace was returned.</p>
        ) : trace.map((item, index) => (
          <div className="modal-section" key={`${item.endpoint}-${index}`}>
            <h4>Step {index + 1}</h4>
            <code>{item.endpoint}</code>
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        ))}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ApiModal;
