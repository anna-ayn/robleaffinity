import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import Chat from "./pages/Chat"
import ChatRoom from "./pages/ChatRoom"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tarjetas from "./pages/Tarjetas";

import LoginAdmin from "./pages/Admin/LoginAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/tarjetas" element={<Tarjetas />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:idChat/:idOtroUsuario" element={<ChatRoom />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />

        <Route path="/loginAdmin" element={<LoginAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
