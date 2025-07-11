import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNatours } from "../context/ToursContext";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const { isLoading, setIsLoading, setUser } = useNatours();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios("http://localhost:5000/api/v2/users/login", {
        method: "POST",
        data: {
          email,
          password,
        },
        withCredentials: true,
      });

      setUser(user);
      navigate(from, { replace: true });

      setFormData({ email: "", password: "" });
      toast.success("Login successful!");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(evnt) =>
                setFormData({ ...formData, email: evnt.target.value })
              }
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={password}
              onChange={(evnt) =>
                setFormData({ ...formData, password: evnt.target.value })
              }
            />
          </div>
          <div className="form__group">
            <button type="submit" className="btn btn--green">
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
