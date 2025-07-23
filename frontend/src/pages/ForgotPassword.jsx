import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();

    if (!email) return toast.error("Please enter your email");

    setIsSending(true);

    try {
      const res = await axios.post("/api/v2/users/forgotPassword", { email });

      toast.success(res.data?.message || "Reset link sent to your email!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to send reset link.";
      toast.error(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Forgot Your Password?</h2>

        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group ma-bt-md">
            <label htmlFor="email" className="form__label">
              Enter your email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form__input"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={isSending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form__group">
            <button
              type="submit"
              className="btn btn--green"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="form__group">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ForgotPassword;
