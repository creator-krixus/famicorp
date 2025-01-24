import { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext"
import { logout } from "../../functions/auth";
import { readAllData } from "../../functions/crud"
import { useNavigate } from "react-router-dom";
import UserLogo from '../../assets/user.png'
import Card from "../../components/cards/Card";
import plus from "../../assets/user-plus.png"
import minus from "../../assets/user-minus.png"
import './dashboard.scss'

export default function UserDashboard() {
  const { user } = UserAuth();
  const [data, setData] = useState([]);
  const [totalAportes, setTotalAportes] = useState(0);
  const navigate = useNavigate();

  // Función para obtener datos de Firestore
  const fetchData = async () => {
    try {
      const result = await readAllData("users");
      setData(result);
      // Calcula el total de aportes
      const total = result.reduce((sum, user) => {
        return sum + (user.aportes?.reduce((acc, num) => acc + num, 0) || 0);
      }, 0);
      setTotalAportes(total);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a fetchData cuando el componente se monta
  }, []);

  const handlerLogout = async () => {
    await logout()
    navigate("/");
  }
  const getFirstName = () => {
    // Si el usuario se autentica con Google, usar displayName
    if (user?.displayName) {
      return user.displayName.split(" ")[0];
    }
    return user?.firstName || "User";
  };
  return (
    <>
      <div className='dashboard'>
        <div className='dashboard__close' onClick={handlerLogout}>Salir</div>
        <div className="dashboard__data">
          <div className='dashboard__user'>Hola, {getFirstName()}
          </div>
          <img className='dashboard__photo' src={user?.photoURL || UserLogo}></img>
        </div>
        <div className="dashboard__infoMoney">
          <div>Total ahorrado</div>
          <div className="dashboard__cash">${totalAportes.toLocaleString("es-ES")}</div>
        </div>
        <div className="dashboard__cards">
          <div className="dashboard__free">
            Disponible
            <p className="dashboard__amount">$000.000</p>
          </div>
          <div className="dashboard__loans">
            Prestamos
            <p className="dashboard__amount">$000.000</p>
          </div>
        </div>
      </div>
      <div className="dashboard__actions">
        <img className='dashboard__add' src={plus}></img>
        <img className='dashboard__lend' src={minus}></img>
      </div>
      <div className="dashboard__dataList">
        {data.length > 0 ? (
          data.map((user) => (
            <Card
              key={user.uid}
              name={user.firstName}
              photo={user.photoURL || UserLogo}
              aportes={user.aportes}
              percentage={totalAportes}
            />
          ))
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>
    </>
  )
}