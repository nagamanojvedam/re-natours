import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

function PasswordChangeForm() {
  const [passwordForm, setPasswordForm] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await axios.patch("/api/v2/users/updateMyPassword", passwordForm, {
        withCredentials: true,
      });

      toast.success("Password updated successfully");
      setPasswordForm({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form form-user-password" onSubmit={handlePasswordChange}>
      <div className="form__group">
        <label className="form__label" htmlFor="password-current">
          Current password
        </label>
        <input
          id="password-current"
          name="passwordCurrent"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isLoading}
          value={passwordForm.passwordCurrent}
          onChange={handleChange}
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="password">
          New password
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
          value={passwordForm.password}
          onChange={handleChange}
        />
      </div>

      <div className="form__group ma-bt-lg">
        <label className="form__label" htmlFor="password-confirm">
          Confirm password
        </label>
        <input
          id="password-confirm"
          name="passwordConfirm"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isLoading}
          value={passwordForm.passwordConfirm}
          onChange={handleChange}
        />
      </div>

      <div className="form__group right">
        <button
          className="btn btn--small btn--green btn--save-password"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating password..." : "Save password"}
        </button>
      </div>
    </form>
  );
}

export default PasswordChangeForm;
