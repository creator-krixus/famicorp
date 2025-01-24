import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";

export default function NonUserRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/*" element={<Login />}></Route>
      </Routes>
    </div>
  )
}