import PropTypes from "prop-types";
import { useState } from "react";
import "./UserSettings.scss";

export default function UserSettings({ onClose, user }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="userSettings">
      <div className="userSettings__close" onClick={onClose}>Cerrar</div>
      <div className="userSettings__info">
        <div>Nombre</div>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>
      <div className="userSettings__info">
        <div>Apellido</div>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

      </div>
      <div className="userSettings__info">
        <div>Email</div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

UserSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
};

UserSettings.defaultProps = {
  user: {},
};

