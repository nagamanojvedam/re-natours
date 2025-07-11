import axios from "axios";
import { useState } from "react";

function PasswordChangeForm() {
  const [passwordForm, setPasswordForm] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const handlePasswordChange = async (evnt) => {
    evnt.preventDefault();

    await axios.patch(
      "http://localhost:5000/api/v2/users/updateMyPassword",
      passwordForm,
      { withCredentials: true }
    );
    setPasswordForm({ passwordCurrent: "", password: "", passwordConfirm: "" });
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
        >
          Save password
        </button>
      </div>
    </form>
  );
}

export default PasswordChangeForm;
