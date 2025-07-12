import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Tour from "./pages/Tour";
import Overview from "./pages/Overview";
import Error from "./pages/Error";
import Bookings from "./pages/Bookings";

axios.defaults.baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route index element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tour/:slug" element={<Tour />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/me" element={<Account />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
