import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Tour from "./pages/Tour";
import Overview from "./pages/Overview";
import Error from "./pages/Error";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route index element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tour/:slug" element={<Tour />} />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
