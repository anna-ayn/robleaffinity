import "../App.css";
import { useEffect, useState } from "react";
import AskPreferences from "../pages/AskPreferences";
import Sidebar from "../components/Sidebar";

export default function Settings() {
  const [showSettings, setShowSettings] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [telefono, setTelefono] = useState(null);
  const [newTheme, setNewTheme] = useState(null);
  const [newLanguage, setNewLanguage] = useState(null);
  const [newNotifications, setNewNotifications] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newTelefono, setNewTelefono] = useState(null);
  const [editInfo, setEditInfo] = useState(false);

  const getInfoCuenta = () => {
    fetch("http://localhost:3001/api/getInfoCuenta", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNewTheme(data.theme);
        setNewLanguage(data.language);
        setNewNotifications(data.notifications);
        setEmail(data.email);
        setTelefono(data.telefono);
      });
  };

  useEffect(() => {
    const fetchInfoCuenta = async () => {
      try {
        await getInfoCuenta();
        setShowSettings(true);
      } catch (error) {
        console.log(error);
        alert("Error 500 al obtener la informacion de la cuenta: ", error);
      }
    };
    fetchInfoCuenta();
  }, []);

  const saveSettings = () => {
    fetch("http://localhost:3001/api/updateSettings", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        idioma: newLanguage,
        tema: newTheme,
        notificaciones: newNotifications,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return;
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
          alert(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
          return;
        }
      })
      .catch((error) => {
        alert("Error 500 al actualizar las configuraciones del app: ", error);
        return;
      });
    alert("Configuraciones actualizadas correctamente");
  };

  const saveInfoCuenta = () => {
    if (password === null) {
      alert("Introduce la contraseña actual para poder guardar los cambios");
      return;
    }
    if (newEmail === null) {
      setNewEmail(email);
    }
    if (newTelefono === null) {
      setNewTelefono(telefono);
    }
    fetch("http://localhost:3001/api/updateInfoCuenta", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        email: newEmail,
        oldpassword: password,
        newpassword: newPassword,
        telefono: newTelefono,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/settings";
          return;
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
          alert(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
          return;
        }
      })
      .catch((error) => {
        alert("Error 500 al actualizar la informacion de la cuenta: ", error);
        return;
      });
  };

  if (!showSettings) {
    return <div>Cargando info de la cuenta...</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="sm:ml-60 ">
        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:grid-rows-1 sm:gap-x-[20px] sm:gap-y-0">
          <div className="mb-5 py-2 px-4 h-full w-[300px]  bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
            <h3 className="mb-3">Información de tu cuenta</h3>
            {editInfo ? (
              <div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="email"
                  >
                    Correo electrónico
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="hola@ejemplo.com"
                    onChange={(e) => setNewEmail(e.target.value)}
                    defaultValue={email}
                    value={newEmail}
                    required
                  />
                </div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="phone"
                  >
                    Teléfono
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="tel"
                    placeholder="Teléfono"
                    onChange={(e) => setNewTelefono(e.target.value)}
                    defaultValue={telefono}
                    value={newTelefono}
                    required
                  />
                </div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="password"
                  >
                    Contraseña actual
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="newPassword"
                  >
                    Contraseña nueva
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    id="newPassword"
                    type="password"
                    placeholder="********"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    required
                  />
                </div>
                <button
                  className="pulse text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={saveInfoCuenta}
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div className="mb-[15px] flex-grow">
                <p className="text-white text-sm font-bold mb-5 text-left">
                  Correo electrónico:{" "}
                  <span className="text-black text-[1rem] font-normal">
                    {email}
                  </span>
                </p>
                <p className="text-white text-sm font-bold mb-5 text-left">
                  Teléfono:{" "}
                  <span className="text-black text-[1rem] font-normal">
                    {telefono}
                  </span>
                </p>
                <p className="text-white text-sm font-bold mb-5 text-left">
                  Contraseña:{" "}
                  <span className="text-black text-[1rem] font-normal">
                    ********
                  </span>
                </p>
                <button
                  className="pulse text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setEditInfo(!editInfo)}
                >
                  Editar
                </button>
              </div>
            )}
          </div>
          <div className="mb-5 py-2 px-4 h-full w-[300px]  bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
            <h3 className="mb-3">Ajusta las configuraciones de tu app</h3>
            <div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="theme"
                >
                  Tema
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="theme"
                  onChange={(e) => setNewTheme(e.target.value)}
                  value={newTheme}
                  required
                >
                  <option value="false">Claro</option>
                  <option value="true">Oscuro</option>
                </select>
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="language"
                >
                  Idioma
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="language"
                  onChange={(e) => setNewLanguage(e.target.value)}
                  value={newLanguage}
                  required
                >
                  <option value="ESP">Español</option>
                  <option value="ENG">Inglés</option>
                </select>
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="notifications"
                >
                  Notificaciones
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="notifications"
                  onChange={(e) => setNewNotifications(e.target.value)}
                  value={newNotifications}
                  required
                >
                  <option value="true">Activadas</option>
                  <option value="false">Desactivadas</option>
                </select>
              </div>
            </div>
            <button
              className="pulse text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline"
              type="button"
              onClick={saveSettings}
            >
              Guardar
            </button>
          </div>
          <AskPreferences />
        </div>
      </div>
    </div>
  );
}
