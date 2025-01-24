import { useState } from "react";
import { signIn } from "../../functions/auth";
import logo from '../../assets/loguito.svg'
import waveBottom from '../../assets/waveBottom.svg'
import './Login.scss'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const handleLoginUser = () => {
    const validationResult = validateInputs();
    if (validationResult === true) {
      console.log("Logging in user...");
      signIn(email, password);
    } else {
      alert('Completa el formulario para poder ingresar')
      console.error("Validation errors:", validationResult);
    }
  };

  return (
    <div className="login">
      <div className="login__wave">
        <div className="login__logo">
          <img src={logo} />
          <p className="login__slogan">FamiCorp</p>
        </div>
      </div>
      <img src={waveBottom} />
      <div className="login__info">
        <p className="login__gretting">Welcome</p>
        <input
          className="login__item"
          type="email"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login__item"
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="login__btn" onClick={handleLoginUser}>Login</div>
    </div>
  )
}
