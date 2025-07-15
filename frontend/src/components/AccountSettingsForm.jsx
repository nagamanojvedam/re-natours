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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const {
        data: {
          data: { user: updatedUser },
        },
      } = await axios.patch("/api/v2/users/updateMyData", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(updatedUser);
      toast.success("Account details updated!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating account details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, photo: file }));
    setPreviewUrl(URL.createObjectURL(file));
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
          name="name"
          value={form.name}
          onChange={handleInputChange}
          disabled={isLoading}
          required
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
          name="email"
          value={form.email}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />
      </div>

      <div className="form__group form__photo-upload">
        <img
          className="form__user-photo"
          src={previewUrl || `/img/users/${user?.photo || "default.jpg"}`}
          alt="User"
        />
        <input
          id="photo"
          className="form__upload"
          type="file"
          accept="image/*"
          name="photo"
          disabled={isLoading}
          onChange={handlePhotoChange}
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
