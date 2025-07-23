import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (evnt) => {
    const { name, value } = evnt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();

    const { password, passwordConfirm } = formData;

    if (!password || !passwordConfirm)
      return toast.error("Please fill in all fields");

    if (password !== passwordConfirm)
      return toast.error("Passwords do not match");

    setIsSubmitting(true);

    try {
      await axios.patch(`/api/v2/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Reset failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Reset Your Password</h2>

        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="password" className="form__label">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form__input"
              placeholder="••••••••"
              autoComplete="new-password"
              minLength="8"
              required
              disabled={isSubmitting}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label htmlFor="passwordConfirm" className="form__label">
              Confirm New Password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              className="form__input"
              placeholder="••••••••"
              autoComplete="new-password"
              minLength="8"
              required
              disabled={isSubmitting}
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          <div className="form__group">
            <button
              type="submit"
              className="btn btn--green"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ResetPassword;
