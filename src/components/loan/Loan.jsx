import PropTypes from "prop-types";
import { useState } from "react";
import { updateData } from "../../functions/crud";
import "./Loan.scss";

export default function Loan({ onClose, users }) {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(1);
  const interestRate = 0.018;
  const [selectedUser, setSelectedUser] = useState("");
  const [installments, setInstallments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  const calculateInstallments = () => {
    const monthlyRate = interestRate;
    const cuota = Math.ceil(amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    let remainingDebt = amount;
    let table = [];
    let total = 0;

    for (let i = 1; i <= months; i++) {
      const interest = Math.ceil(remainingDebt * monthlyRate);
      const principal = cuota - interest;
      remainingDebt -= principal;
      table.push({ month: i, cuota, interest, principal, remainingDebt: Math.max(remainingDebt, 0) });
      total += cuota;
    }
    setInstallments(table);
    setTotalPaid(total);
    return total;
  };

  const handleUpdate = async () => {
    if (!selectedUser) {
      alert("Seleccione un usuario");
      return;
    }

    const user = users.find(user => `${user.firstName} ${user.lastName}` === selectedUser);
    if (!user) {
      console.error("Usuario no encontrado");
      return;
    }

    const total = calculateInstallments();

    try {
      await updateData("users", user.uid, { loan: total });
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando datos", error);
    }
  };

  const handleReset = () => {
    setAmount(50000);
    setMonths(1);
    setSelectedUser("");
    setInstallments([]);
    setTotalPaid(0);
  };

  return (
    <div className="loan">
      <div className="loan__header">
        <h2>Simulador de Préstamo</h2>
        <div className="loan__close" onClick={onClose}>Cerrar</div>
      </div>
      <div className="loan__form">
        <label>Monto del préstamo:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <label>Meses:</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <button onClick={calculateInstallments}>Calcular</button>
        <button onClick={handleReset}>Limpiar Campos</button>
      </div>
      {installments.length > 0 && (
        <div className="loan__table">
          <div>Tabla de Amortización</div>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Cuota</th>
                <th>Interés</th>
                <th>Capital</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {installments.map(row => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{row.cuota}</td>
                  <td>{row.interest}</td>
                  <td>{row.principal}</td>
                  <td>{row.remainingDebt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total Pagado: {totalPaid}</h4>
          <label>Usuario:</label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Seleccionar usuario</option>
            {users.map(user => (
              <option key={user.uid} value={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
          <button onClick={handleUpdate}>Actualizar Base de Datos</button>
        </div>
      )}
    </div>
  );
}

Loan.propTypes = {
  onClose: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired
    })
  ).isRequired,
};








