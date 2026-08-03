function EmptyState({ message }) {
  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "18px",
      }}
    >
      {message || "No data available."}
    </div>
  );
}

export default EmptyState;