import PropTypes from "prop-types";
import { useState } from "react";
import { updateData } from "../../functions/crud";
import "./Loan.scss";

export default function Loan({ onClose, users }) {
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(0);
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
    const now = new Date();
    const loanDate = {
      seconds: Math.floor(now.getTime() / 1000),
      nanoseconds: (now.getTime() % 1000) * 1e6
    };

    try {
      await updateData("users", user.uid, {
        loan: amount,
        totalPayLoan: {
          amount: total,
          months: months,
          quota: total / months,
          date: loanDate
        }
      });
      alert("Datos actualizados correctamente");
      setInstallments([]);
      handleReset()
    } catch (error) {
      console.error("Error actualizando datos", error);
    }
  };

  const handleReset = () => {
    setAmount(0);
    setMonths(0);
    setSelectedUser("");
    setInstallments([]);
    setTotalPaid(0);
  };

  return (
    <div className="loan">
      <div className="loan__header">
        <div className="loan__title"></div>
        <div className="loan__close" onClick={onClose}>Cerrar</div>
      </div>
      <div className="loan__form">
        <p className="loan__label">Monto del préstamo:</p>
        <input className="loan__input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <p className="loan__label">Meses:</p>
        <input className="loan__input" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <section className="loan__btns">
          <button className="loan__btn" onClick={calculateInstallments}>Calcular</button>
          <button className="loan__btn" onClick={handleReset}>Limpiar</button>
        </section>
      </div>
      {installments.length > 0 && (
        <div className="loan__table">
          <div className="loan__title">Tabla de Amortización</div>
          <table className="loan__info">
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
                  <td>{row.cuota.toLocaleString("es-ES")}</td>
                  <td>{row.interest.toLocaleString("es-ES")}</td>
                  <td>{row.principal.toLocaleString("es-ES")}</td>
                  <td>{row.remainingDebt.toLocaleString("es-ES")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total a pagar: {totalPaid.toLocaleString("es-ES")}</h4>
          <select className="loan__users" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Seleccionar usuario</option>
            {users.map(user => (
              <option key={user.uid} value={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
          <button className="loan__btn" onClick={handleUpdate}>Generar préstamo</button>
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








