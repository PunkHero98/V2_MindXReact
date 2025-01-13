import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import HeaderLayout from "./layouts/HeaderLayout";
import ManageNote from "./pages/manage/manageNote/ManageNote";
import ManageUser from "./pages/manage/manageUser/ManageUser";
import Account from "./pages/account/Account";
import Setting from "./pages/setting/Setting";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./styles/App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HeaderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="manageuser" element={<ManageUser />} />
        <Route path="managenote" element={<ManageNote />} />
        <Route path="setting" element={<Setting />} />
      </Route>
    </Routes>
  );
}

export default App;
