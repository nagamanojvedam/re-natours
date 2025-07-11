import { useState } from "react";
import axios from "axios";
import { useNatours } from "../context/ToursContext";
import { toast } from "react-toastify";

function AccountSettingsForm() {
  const { user, setUser } = useNatours();
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    photo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUpdate = async (evnt) => {
    evnt.preventDefault();

    console.log("updating user details");
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.photo) formData.append("photo", form.photo);

      const {
        data: {
          data: { user },
        },
      } = await axios.patch(
        "/api/v2/users/updateMyData",
        // "http://localhost:5000/api/v2/users/updateMyData",
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(user);
      setIsLoading(false);
      toast.success("Account Details Updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating account details");
    }
  };

  return (
    <form className="form form-user-data" onSubmit={handleUpdate}>
      <div className="form__group">
        <label className="form__label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="form__input"
          type="text"
          value={form.name}
          onChange={(evnt) => setForm({ ...form, name: evnt.target.value })}
          required
          name="name"
          disabled={isLoading}
        />
      </div>
      <div className="form__group ma-bt-md">
        <label className="form__label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          className="form__input"
          type="email"
          defaultValue={form.email}
          onChange={(evnt) => setForm({ ...form, email: evnt.target.value })}
          required
          name="email"
          disabled={isLoading}
        />
      </div>
      <div className="form__group form__photo-upload">
        <img
          className="form__user-photo"
          src={
            previewUrl ||
            `http://localhost:5000/img/users/${user?.photo || "default.jpg"}`
          }
          alt={`${user?.name || "User"}'s photo`}
        />
        <input
          id="photo"
          className="form__upload"
          type="file"
          accept="image/*"
          name="photo"
          disabled={isLoading}
          onChange={(evnt) => {
            setForm({ ...form, photo: evnt.target.files[0] });
            setPreviewUrl(URL.createObjectURL(evnt.target.files[0]));
          }}
        />
        <label className="form__label" htmlFor="photo">
          Choose new photo
        </label>
      </div>
      <div className="form__group right">
        <button
          className="btn btn--small btn--green"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}

export default AccountSettingsForm;
