import "./LoadingState.css";

function EmptyState({
  title = "No Data",
  message = "Nothing to display."
}) {
  return (
    <div className="state-container">

      <h1>📭</h1>

      <h2>{title}</h2>

      <p>{message}</p>

    </div>
  );
}

export default EmptyState;