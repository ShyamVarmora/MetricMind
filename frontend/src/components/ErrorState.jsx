import "./LoadingState.css";

function ErrorState({ message = "Unable to load data.", onRetry }) {
  return (
    <div className="state-container">
      <h1>⚠️</h1>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}

export default ErrorState;
