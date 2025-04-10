import { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext";
import { logout } from "../../functions/auth";
import { readAllData } from "../../functions/crud"
import { useNavigate } from "react-router-dom";
import UserLogo from '../../assets/user.png'
import Card from "../../components/cards/Card";
import Contributions from "../../components/contributions/Contributions";
import Settings from "../../components/userSettings/UserSettings"
import Loan from "../../components/loan/Loan";
import plus from "../../assets/user-plus.png";
import minus from "../../assets/user-minus.png";
import './dashboard.scss';

export default function UserDashboard() {
  const { user } = UserAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [contributions, setContributions] = useState(false);
  const [viewMode, setViewMode] = useState("team");
  const [settings, setSettings] = useState(false);
  const [totalAportes, setTotalAportes] = useState(0);
  const [loans, setLoans] = useState(0);
  const [modalLoan, setModalLoan] = useState(false);
  const [available, setAvailable] = useState(0)
  const navigate = useNavigate();

  // Función para obtener datos de Firestore
  const fetchData = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const result = await readAllData("users");
      setData(result);
      // Calcula el total de aportes
      const total = result.reduce((sum, user) => {
        return sum + (user.aportes?.reduce((acc, num) => acc + num, 0) || 0);
      }, 0);
      setTotalAportes(total);
      // Obtiene todos los préstamos con intereses
      const allLoans = result.map(user => user.totalPayLoan?.amount || []).flat().reduce((acc, num) => acc + num, 0) || 0;
      setLoans(allLoans);
      // Obtiene todos los préstamos reales
      const allLoansReal = result.map(user => user.loan || []).flat().reduce((acc, num) => acc + num, 0) || 0;
      //Obtiene todos los abonos a prestamos
      const allPayLoans = result.map(user => user.payLoan || []).flat().reduce((acc, num) => acc + num, 0) || 0
      //Obtine lo disponible
      setAvailable(total - allLoansReal + allPayLoans)

    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  const close = () => {
    setContributions(false)
    fetchData()
  }

  const closeSettings = () => {
    setSettings(false)
  }

  const closeLoan = () => {
    setModalLoan(false)
    fetchData()
  }

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
      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      )}
      <div className='dashboard'>
        <div className='dashboard__close' onClick={handlerLogout}>Salir</div>
        <div className="dashboard__data">
          <div className='dashboard__user'>Hola, {getFirstName()}
          </div>
          <img className='dashboard__photo' src={user?.photoURL || UserLogo} onClick={() => setSettings(true)}></img>
        </div>
        {settings && (
          <Settings onClose={closeSettings} user={user} />
        )}
        <div className="dashboard__infoMoney">
          <div>
            <div>Total ahorrado</div>
            <div className="dashboard__cash">${totalAportes.toLocaleString("es-ES")}</div>
          </div>
          <div>
            <div>Ganancias</div>
            <div className="dashboard__cash">${(loans + available - totalAportes).toLocaleString("es-ES")}</div>
          </div>
        </div>
        <div className="dashboard__cards">
          <div className="dashboard__free">
            Disponible
            <p className="dashboard__amount">${available.toLocaleString("es-ES")}</p>
          </div>
          <div className="dashboard__loans" onClick={() => setViewMode("loan")}>
            Prestamos
            <p className="dashboard__amount">${loans.toLocaleString("es-ES")}</p>
          </div>
        </div>
      </div>
      {user?.role === "admin" && (
        <div className="dashboard__actions">
          <img className="dashboard__add" src={plus} alt="Add" onClick={() => setContributions(true)} />
          <img className="dashboard__lend" src={minus} alt="Lend" onClick={() => setModalLoan(true)} />
          {contributions && (
            <Contributions onClose={close} users={data} />
          )}
          {modalLoan && (
            <Loan onClose={closeLoan} users={data} />
          )}
        </div>
      )}
      {/* 🔹 Botones para cambiar entre vistas */}
      {/* <div className="dashboard__filters">
        <span className={viewMode === 'team' ? 'dashboard__active' : 'dashboard__team'} onClick={() => setViewMode("team")}>Socios</span>
        <span className={viewMode === 'loan' ? 'dashboard__active' : 'dashboard__loan'} onClick={() => setViewMode("loan")}>Préstamos</span>
      </div> */}
      <div className="dashboard__filters">
        <span className={viewMode === 'team' ? 'dashboard__active' : 'dashboard__team'} onClick={() => setViewMode("team")}>Socios</span>
        <span className={viewMode === 'loan' ? 'dashboard__active' : 'dashboard__loan'} onClick={() => setViewMode("loan")}>Préstamos</span>
        <span className={viewMode === 'clients' ? 'dashboard__active' : 'dashboard__clients'} onClick={() => setViewMode("clients")}>Clientes</span>
      </div>

      {/* 🔹 Mostrar contenido según el valor de "viewMode" */}
      <div className="dashboard__dataList">
        {viewMode === "team" ? (
          data.length > 0 ? (
            data.filter(user => user.role === "user" || user.role === "admin").map((user) => (
              <Card
                key={user.uid}
                name={user.firstName}
                lastName={user.lastName}
                photo={user.photoURL || UserLogo}
                aportes={user.aportes}
                percentage={totalAportes}
              />
            ))
          ) : (
            <p>No hay datos disponibles.</p>
          )
        ) : viewMode === "loan" ? (
          <div>
            {data.filter((user) => user.loan).length > 0 ? (
              data
                .filter((user) => user.loan)
                .map((user) => (
                  <Card
                    key={user.uid}
                    name={user.firstName}
                    lastName={user.lastName}
                    photo={user.photoURL || UserLogo}
                    loan={user.loan}
                    loanDate={user.totalPayLoan.date}
                    aportes={user.aportes}
                    percentage={totalAportes}
                    totalPayLoan={user.totalPayLoan}
                    isLoanView="loan"
                  />
                ))
            ) : (
              <p>No hay usuarios con préstamos</p>
            )}
          </div>
        ) : viewMode === "clients" ? (
          <div>
            {/* Aquí va el contenido de la vista de clientes */}
            {data
              .filter(user => user.role === "client") 
              .map((user) => (
                <Card
                  key={user.uid}
                  name={user.firstName}
                  lastName={user.lastName}
                  photo={user.photoURL || UserLogo}
                  // aportes={user.aportes}
                  percentage={totalAportes}
                />
              ))}
          </div>
        ) : null}
      </div>
    </>
  )
}