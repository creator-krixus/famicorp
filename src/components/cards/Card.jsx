import PropTypes from 'prop-types';
import "./Card.scss";

export default function Card({ name, photo, aportes, percentage }) {
  // Calcular el total sumando los números del array
  const total = aportes?.reduce((acc, curr) => acc + curr, 0) || 0;
  // Formatear el total con puntos separadores de miles
  const formattedTotal = total.toLocaleString("es-ES");
  return (
    <div className="card">
      <img className="card__photo" src={photo} alt={`${name}'s avatar`} />
      <div className="card__info">
        <div>
          <div className="card__name">{name || "Nombre no disponible"}</div>
          <div className="card__total">${formattedTotal}</div>
        </div>
        <div className="card__percentage">{(total * 100 / percentage).toFixed(2)}%</div>
      </div>
    </div>
  );
}

Card.propTypes = {
  name: PropTypes.node.isRequired,
  photo: PropTypes.node.isRequired,
  aportes: PropTypes.node.isRequired,
  percentage: PropTypes.node.isRequired,
};
