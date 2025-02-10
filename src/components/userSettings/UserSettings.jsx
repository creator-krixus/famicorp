import PropTypes from "prop-types";
import "./UserSettings.scss"

export default function UserSettings({ onClose, user }) {
  return (
    <div className="userSettings">UserSettings
      <div className="userSettings__close" onClick={onClose}>Cerrar</div>
      <div>{JSON.stringify(user, null, 2) }</div>
    </div>
  )
}

UserSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object
};
