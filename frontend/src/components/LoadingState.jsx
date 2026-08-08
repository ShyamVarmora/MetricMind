import "./LoadingState.css";

function LoadingState() {
  return (
    <div className="state-container">
      <div className="loader"></div>

      <h2>Loading...</h2>

      <p>Please wait while data is loading.</p>
    </div>
  );
}

export default LoadingState;