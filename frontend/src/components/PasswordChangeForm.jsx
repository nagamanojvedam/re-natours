import axios from "axios";
import { useState } from "react";
import { useNatours } from "../context/ToursContext";
import { toast } from "react-toastify";

function PasswordChangeForm() {
  const [passwordForm, setPasswordForm] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });
  const { isLoading, setIsLoading } = useNatours();
  const handlePasswordChange = async (evnt) => {
    evnt.preventDefault();

    try {
      setIsLoading(true);
      await axios.patch(
        "http://localhost:5000/api/v2/users/updateMyPassword",
        passwordForm,
        { withCredentials: true }
      );
      setPasswordForm({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
      toast.success("Password updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error updating password");
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
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength="8"
          disabled={isLoading}
          value={passwordForm.passwordCurrent}
          onChange={(evnt) =>
            setPasswordForm({
              ...passwordForm,
              passwordCurrent: evnt.target.value,
            })
          }
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength="8"
          value={passwordForm.password}
          disabled={isLoading}
          onChange={(evnt) =>
            setPasswordForm({
              ...passwordForm,
              password: evnt.target.value,
            })
          }
        />
      </div>
      <div className="form__group ma-bt-lg">
        <label className="form__label" htmlFor="password-confirm">
          Confirm password
        </label>
        <input
          id="password-confirm"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength="8"
          value={passwordForm.passwordConfirm}
          disabled={isLoading}
          onChange={(evnt) =>
            setPasswordForm({
              ...passwordForm,
              passwordConfirm: evnt.target.value,
            })
          }
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
