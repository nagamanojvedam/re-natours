import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNatours } from "../context/ToursContext";

function ProtectedRoute() {
  const { user } = useNatours();
  const location = useLocation();

  // Return a loading spinner or null while auth is being determined
  if (user === undefined) {
    return (
      <div className="centered">
        <span className="spinner" /> {/* Or your preferred loader */}
      </div>
    );
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default ProtectedRoute;
