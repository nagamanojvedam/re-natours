// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import axios from "axios";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Pages (lazy-loaded)
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Account = lazy(() => import("./pages/Account"));
const Tour = lazy(() => import("./pages/Tour"));
const Overview = lazy(() => import("./pages/Overview"));
const Error = lazy(() => import("./pages/Error"));
const Bookings = lazy(() => import("./pages/Bookings"));

axios.defaults.baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

function App() {
  const location = useLocation();

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tour/:slug" element={<Tour />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/me" element={<Account />} />
            <Route path="/bookings" element={<Bookings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Error path={location.pathname} />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
