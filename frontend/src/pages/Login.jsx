import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNatours } from "../context/ToursContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useNatours();

  const redirectTo = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (evnt) => {
    const { name, value } = evnt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post("/api/v2/users/login", formData, {
        withCredentials: true,
      });

      const user = response.data?.data?.user;

      if (user) {
        setUser(user);
        toast.success("Login successful!");
        navigate(redirectTo, { replace: true });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>

        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form__input"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form__input"
              placeholder="••••••••"
              autoComplete="current-password"
              minLength="8"
              required
              disabled={isLoading}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form__group forgot-password">
            <button
              type="submit"
              className="btn btn--green"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
