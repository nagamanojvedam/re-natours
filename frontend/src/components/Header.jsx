import { Link, Navigate, useNavigate } from "react-router-dom";
import { useNatours } from "../context/ToursContext";
import axios from "axios";
import { toast } from "react-toastify";

function Header() {
  const { user, setUser } = useNatours();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // await axios.get("http://localhost:5000/api/v2/users/logout", {
      await axios.get("/api/v2/users/logout", {
        withCredentials: true,
      });
      setUser(null);
      toast.success("Logout successful!");
    } catch (err) {
      console.error("Error logging out", err);
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
        {" "}
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {user ? (
          <div className="nav__container" onClick={() => navigate("/me")}>
            <img
              className="nav__user-avatar"
              src={`http://localhost:5000/img/users/${user?.photo}`}
              alt={`${user?.name || "User"}'s photo`}
            />
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
              Sign up{" "}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
