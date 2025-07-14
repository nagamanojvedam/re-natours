function LoadingSpinner({ size = 50 }) {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{ width: size, height: size }}
        aria-label="Loading"
      ></div>
    </div>
  );
}

export default LoadingSpinner;
