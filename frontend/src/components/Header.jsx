import { Link, useNavigate } from "react-router-dom";
import { useNatours } from "../context/ToursContext";
import axios from "axios";
import { toast } from "react-toastify";

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/";

function Header() {
  const { user, setUser } = useNatours();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("/api/v2/users/logout", {
        withCredentials: true,
      });
      setUser(null);
      toast.success("Logout successful!");
      navigate("/"); // Optional: redirect to home after logout
    } catch (err) {
      console.error("Error logging out", err);
      toast.error("Logout failed!");
    }
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          All Tours
        </Link>
      </nav>

      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>

      <nav className="nav nav--user">
        {user ? (
          <div className="nav__user">
            <div className="nav__user-info" onClick={() => navigate("/me")}>
              <img
                className="nav__user-avatar"
                src={`${baseURL}img/users/${user?.photo || "default.jpg"}`}
                alt={`${user?.name || "User"}'s photo`}
              />
              <span className="nav__user-name">{user?.name}</span>
            </div>
            <button className="nav__el nav__el--cta" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <>
            <Link className="nav__el" to="/login">
              Log in
            </Link>
            <Link className="nav__el nav__el--cta" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
