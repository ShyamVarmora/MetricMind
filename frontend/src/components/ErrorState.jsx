import "./LoadingState.css";

function ErrorState() {
  return (
    <div className="state-container">

      <h1>⚠️</h1>

      <h2>Something went wrong</h2>

      <p>Unable to load data.</p>

      <button>
        Retry
      </button>

    </div>
  );
}

export default ErrorState;