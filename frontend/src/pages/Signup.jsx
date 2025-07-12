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

  const { name, email, password, passwordConfirm } = details;

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();

    try {
      setIsLoading(true);
      const {
        data: {
          data: { user },
        },
        // } = await axios("http://localhost:5000/api/v2/users/signup", {
      } = await axios("/api/v2/users/signup", {
        method: "POST",
        data: {
          name,
          email,
          password,
          passwordConfirm,
        },
        withCredentials: true,
      });
      setIsLoading(false);
      setUser(user);
      navigate("/");
      toast.success("Signup successful!");
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error(err.response.data.message);
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
              className="form__input"
              type="text"
              placeholder="Your name"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="Your email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
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
              disabled={isLoading}
              minLength={8}
              value={password}
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
            />
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="passwordConfirm">
              Password Confirm
            </label>
            <input
              id="passwordConfirm"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={8}
              value={passwordConfirm}
              onChange={(e) =>
                setDetails({ ...details, passwordConfirm: e.target.value })
              }
            />
          </div>

          <div className="form__group">
            <button
              type="submit"
              className="btn btn--green"
              disabled={isLoading}
            >
              {!isLoading ? "Signup" : "Signing up..."}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default SignupForm;
