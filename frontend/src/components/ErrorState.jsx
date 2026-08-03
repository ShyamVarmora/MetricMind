function ErrorState({ message }) {
  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
        color: "#dc2626",
        fontWeight: "600",
        fontSize: "18px",
      }}
    >
      {message || "Something went wrong."}
    </div>
  );
}

export default ErrorState;