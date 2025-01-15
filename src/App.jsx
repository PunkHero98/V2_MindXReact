import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import HeaderLayout from "./layouts/HeaderLayout";
import ManageNote from "./pages/manage/manageNote/ManageNote";
import ChatApp from "./pages/manage/chatApp/ChatApp";
import Account from "./pages/account/Account";
import Setting from "./pages/setting/Setting";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/404Page/NotFound";
import PlayGroundLayout from "./layouts/PlayGroundLayout";
import Chess from "./pages/playGround/game/Chess";
import Caro from "./pages/playGround/game/Caro";
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
        <Route path="account/:id" element={<Account />} />
        <Route path="manageuser" element={<ChatApp />} />
        <Route path="managenote" element={<ManageNote />} />
        <Route path="setting" element={<Setting />} />
        <Route path="playground" element={<PlayGroundLayout />}>
          <Route path="caro" element={<Caro />} />
          <Route path="chess" element={<Chess />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
