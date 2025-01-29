import { useState, useEffect } from "react";
import { signIn, logout } from "../../functions/auth";
import logo from '../../assets/loguito.svg'
import waveBottom from '../../assets/waveBottom.svg'
import './Login.scss'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let inactivityTimer;

  // Función para reiniciar el temporizador de inactividad
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log("Sesión cerrada por inactividad");
      logout(); // Cerrar sesión automáticamente
    }, 60 * 60 * 1000); // 1 hora
  };

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

  // Manejo del inicio de sesión
  const handleLoginUser = async () => {
    const validationResult = validateInputs();
    if (validationResult === true) {
      console.log("Logging in user...");
      const user = await signIn(email, password);
      if (user) {
        localStorage.setItem("loginTime", Date.now()); // Guardar hora de inicio de sesión
        resetInactivityTimer(); // Iniciar el temporizador
      }
    } else {
      alert('Completa el formulario para poder ingresar');
      console.error("Validation errors:", validationResult);
    }
  };

  useEffect(() => {
    // Detectar eventos del usuario y reiniciar temporizador
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Revisar si la sesión ya superó 1 hora
    const checkSessionTimeout = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime && Date.now() - loginTime > 60 * 60 * 1000) {
        console.log("Sesión expirada");
        logout();
      }
    };

    checkSessionTimeout();

    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  });

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
