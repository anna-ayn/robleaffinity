import { useEffect, useState } from "react";
import "../App.css";

function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/getData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.error) {
        alert(res.error);
      } else {
        res.json().then(async (res) => {
          setUserData(res);
        });
      }
    });
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {userData ? (
        <div>
          <h1>
            Bienvenido, {userData.nombre} {userData.apellido}!
          </h1>
          <p>Tu correo es {userData.email}</p>
          <p>Tu número de teléfono es {userData.telefono}</p>
          <p>Tu fecha de nacimiento es {userData.fecha_nacimiento}</p>
          <p>Tu idioma de la app es {userData.idioma}</p>
          <p>
            Tus notificaciones están {userData.notificaciones ? "ON" : "OFF"}
          </p>
          <p>Tu tema de la app es {userData.tema ? "Claro" : "Oscuro"}</p>
          <p>Tu sexo es {userData.sexo}</p>
          <p>Tu(s) foto(s) de perfil son:</p>
          {userData.fotos.map((foto, index) => (
            <img
              key={index}
              src={`data:image/jpg;base64,${foto}`}
              className="w-[20%] m-auto"
            />
          ))}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button
        onClick={logOut}
        className="bg-[#de5466] hover:bg-[#e02841] text-white font-bold py-2 px-4 rounded"
      >
        Salir
      </button>
    </>
  );
}

export default Dashboard;
