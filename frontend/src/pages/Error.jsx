import { useLocation } from "react-router-dom";

function Error() {
  const location = useLocation();
  const message =
    location.state?.message || "Something went wrong. Please try again later.";

  return (
    <main className="main">
      <div className="error">
        <div className="error__title">
          <h2 className="heading-secondary heading-secondary--error">
            Uh oh! Something went wrong!
          </h2>
          <h2 className="error__emoji">😢 🤯</h2>
        </div>
        <div className="error__msg">
          <p>{message}</p>
        </div>
      </div>
    </main>
  );
}

export default Error;
