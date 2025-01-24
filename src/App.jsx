import { UserAuth } from "./context/authContext"
import NonUserRoutes from "./routes/NonUserRoutes"
import UserRoutes from "./routes/UserRoutes"
import './App.css'

function App() {
  const { isLoggedOut } = UserAuth()
  return (
    <div className="app">
      {isLoggedOut ? <NonUserRoutes /> : <UserRoutes />}
    </div>
  )
}

export default App
