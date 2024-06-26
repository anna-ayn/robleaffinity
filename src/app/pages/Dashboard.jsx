import React, { useEffect, useState } from "react";
import "../App.css";
import logo from "../img/Logo.png";

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

  return (
    <>
      {userData ? (
        <div>
          <img
            src={logo}
            onClick={() => (window.location.href = "/")}
            className="self-stretch w-[80%] sm:w-[30%] m-auto cursor-pointer"
          />
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
          <p>Tu foto(s) de perfil son:</p>
          {userData.fotos.map((foto, index) => (
            <img key={index} src={`data:image/png;base64,${foto}`} />
          ))}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
}

export default Dashboard;
