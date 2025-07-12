import axios from "axios";
import { useState } from "react";
import { useNatours } from "../context/ToursContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignupForm() {
  const { setUser } = useNatours();
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    const { name, email, password, passwordConfirm } = details;

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const {
        data: {
          data: { user },
        },
      } = await axios("/api/v2/users/signup", {
        method: "POST",
        data: { name, email, password, passwordConfirm },
        withCredentials: true,
      });

      setUser(user);
      navigate("/");
      toast.success("Signup successful!");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Signup failed";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Create your account</h2>
        <form className="form form--signup" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              className="form__input"
              type="text"
              placeholder="Your name"
              required
              disabled={isLoading}
              value={details.name}
              onChange={handleChange}
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              className="form__input"
              type="email"
              placeholder="Your email"
              required
              disabled={isLoading}
              value={details.email}
              onChange={handleChange}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              disabled={isLoading}
              value={details.password}
              onChange={handleChange}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="passwordConfirm">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              disabled={isLoading}
              value={details.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          <div className="form__group">
            <button
              type="submit"
              className="btn btn--green"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Signup"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default SignupForm;
