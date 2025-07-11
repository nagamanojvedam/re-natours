import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNatours } from "../context/ToursContext";

function ProtectedRoute() {
  const { user } = useNatours();
  const location = useLocation();

  if (user === undefined) return null;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default ProtectedRoute;
