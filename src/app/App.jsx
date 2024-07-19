import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Dashboard from "./pages/Dashboard";
import AskPreferences from "./pages/AskPreferences";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tarjetas from "./pages/Tarjetas"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/preferences" element={<AskPreferences />} />
        <Route
          path="/first-time-setting-preferences"
          element={<AskPreferences firstTime={true} />}
        />
        <Route path="/tarjetas" element={<Tarjetas />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
