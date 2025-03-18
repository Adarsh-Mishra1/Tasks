function LoadingSpinner() {
  return (
    <div className="new-overlay">
      <div
        className="spinner-border text-light spinner-border-lg"
        role="status"
        style={{ height: "50px", width: "50px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
