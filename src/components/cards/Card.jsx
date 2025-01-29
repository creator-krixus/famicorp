import PropTypes from 'prop-types';
import "./Card.scss";

export default function Card({ name, photo, aportes, percentage, lastName, loan, isLoanView }) {
  // Convertir la cadena "loan" en un booleano
  const isLoanMode = isLoanView === "loan";

  // Calcular el total sumando los números del array
  const total = aportes?.reduce((acc, curr) => acc + curr, 0) || 0;
  const formattedTotal = total.toLocaleString("es-ES");
  const formattedLoan = loan ? loan.toLocaleString("es-ES") : null;

  return (
    <div className="card">
      <img className="card__photo" src={photo} alt={`${name}'s avatar`} />
      <div className="card__info">
        <div>
          <div className="card__name">{name || "Nombre no disponible"} {lastName}</div>

          {/* Si isLoanMode llega, mostrar el préstamo; si no, mostrar el total */}
          {isLoanMode ? (
            <div className="card__loan">${formattedLoan}</div>
          ) : (
            <div className="card__total">${formattedTotal}</div>
          )}
        </div>

        {/* Mostrar porcentaje solo si NO estamos en modo préstamo */}
        {!isLoanMode && (
          <div className="card__percentage">{(total * 100 / percentage).toFixed(2)}%</div>
        )}
      </div>
    </div>
  );
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  aportes: PropTypes.arrayOf(PropTypes.number).isRequired,
  percentage: PropTypes.number.isRequired,
  loan: PropTypes.number,
  isLoanView: PropTypes.string
};

