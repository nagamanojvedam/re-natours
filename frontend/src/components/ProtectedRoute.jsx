import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useNatours } from "../context/ToursContext";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useNatours();

  useEffect(() => {
    if (user) setIsAuthenticated(true);
  }, [user]);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
