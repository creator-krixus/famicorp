import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react"; // Añadimos useRef y useEffect
import { updateData, readData } from "../../functions/crud"; // Importamos las funciones
import "./Contributions.scss";

export default function Contributions({ onClose, users }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");

  const modalRef = useRef(null); // Referencia al modal

  const handleClick = (option) => {
    setSelectedOption(option);
    setShowForm(true);
  };

  const handleUpdate = async () => {
    console.log("Opción seleccionada:", selectedOption);
    console.log("Usuario seleccionado:", selectedUser);
    console.log("Monto seleccionado:", selectedAmount);

    if (!selectedUser || !selectedAmount) {
      alert('Faltan datos para completar esta accion')
      console.error("Debe seleccionar un usuario y un monto.");
      return;
    }

    // Buscar el usuario seleccionado en la lista de `users`
    const user = users.find(user => `${user.firstName} ${user.lastName}` === selectedUser);

    if (!user) {
      console.error("Usuario no encontrado.");
      return;
    }

    try {
      // Obtener los datos actuales del usuario en Firebase
      const userData = await readData("users", user.uid);

      if (!userData) {
        console.error("No se encontraron datos del usuario.");
        return;
      }

      // Determinar si es un aporte o un préstamo
      const fieldToUpdate = selectedOption === "aporte mensual" ? "aportes" : "payLoan";

      // Actualizar el array de aportes o préstamos
      const updatedData = {
        [fieldToUpdate]: [...(userData[fieldToUpdate] || []), Number(selectedAmount)]
      };

      // Si es un pago de préstamo, restar la cantidad del préstamo
      if (selectedOption === "pago prestamo") {
        const lastPayment = updatedData.payLoan[updatedData.payLoan.length - 1];
        const updatedLoan = userData.loan - lastPayment; // Restar el pago al préstamo original

        updatedData.loan = updatedLoan; // Actualizar el campo `loan` con el nuevo valor
      }

      // Enviar la actualización a Firebase
      await updateData("users", user.uid, updatedData);

      console.log("Datos actualizados correctamente.");
    } catch (error) {
      console.error("Error actualizando datos:", error);
    }

    setShowForm(false);
  };

  // Cerrar el modal si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Llamar la función onClose si se hace clic fuera del modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Escuchar el clic fuera

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Limpiar el event listener al desmontar el componente
    };
  }, [onClose]);

  return (
    <div className="contributions" ref={modalRef}>{/* Asignamos la referencia al modal */}
      <div className="contributions__btn">
        <div className="contributions__close" onClick={onClose}>Cerrar</div>
      </div>
      <div className="contributions__btns">
        <div className="contributions__month" onClick={() => handleClick("aporte mensual")}>Aporte mensual</div>
        {users.some(user => user.loan > 0) && (
          <div className="contributions__pay" onClick={() => handleClick("pago prestamo")}>Pago préstamo</div>
        )}
      </div>
      {showForm && (
        <div className="contributions__form" >
          <h3 className="contributions__title">{selectedOption}</h3>
          <div className="contributions__data">
            <div className="contributions__options">
              <label className="contributions__label">Usuario:</label>
              <select className="contributions__users" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Seleccionar usuario</option>
                {users
                  .filter(user => selectedOption !== "pago prestamo" || user.loan > 0) // Filtra usuarios con loan > 0
                  .map(user => (
                    <option key={user.uid} value={`${user.firstName} ${user.lastName}`}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="contributions__label">Cantidad:</label>
              {selectedOption === "aporte mensual" ? (
                <select className="contributions__amount" value={selectedAmount} onChange={(e) => setSelectedAmount(e.target.value)}>
                  <option value="">Seleccionar monto</option>
                  <option value="10000">10,000</option>
                  <option value="20000">20,000</option>
                  <option value="30000">30,000</option>
                  <option value="40000">40,000</option>
                </select>
              ) : (
                <input
                  className="contributions__amount"
                  type="number"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  placeholder="Ingrese el monto"
                />
              )}
            </div>

            <button className="contributions__send" onClick={handleUpdate}>Actualizar</button>
          </div>
        </div>
      )}
    </div>
  );
}

Contributions.propTypes = {
  onClose: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      loan: PropTypes.number.isRequired, // Agregado para validar `loan`
    })
  ).isRequired,
};





