import { Link } from "react-router-dom";
import { useNatours } from "../context/ToursContext";
import axios from "axios";

function Header() {
  const { user, setUser } = useNatours();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/v2/users/logout", {
        withCredentials: true,
      });
      setUser(null);
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
          <div className="nav__container">
            <p className="nav__user-name">{user.name.split(" ")[0].at(0)}</p>
            <Link className="nav__el nav__el--cta" to="/login">
              Log out
            </Link>
          </div>
        ) : (
          <>
            <button className="nav__el" onClick={handleLogout}>
              Log in
            </button>
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
