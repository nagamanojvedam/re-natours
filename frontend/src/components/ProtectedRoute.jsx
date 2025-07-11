import { Navigate, useLocation } from "react-router-dom";
import { useNatours } from "../context/ToursContext";

function ProtectedRoute({ children }) {
  const { user } = useNatours();
  const location = useLocation();

  if (user === undefined) return null;

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default ProtectedRoute;
