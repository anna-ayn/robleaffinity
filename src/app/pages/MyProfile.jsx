import { useEffect, useState } from "react";
import "../App.css";
import { FaPen } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

function MyProfile() {
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

  const editDescription = () => {
    const newDescription = prompt("Escribe tu nueva descripcion");
    if (newDescription) {
      fetch("http://localhost:3001/api/editDescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ descripcion: newDescription }),
      })
        .then((res) => {
          if (res.error) {
            alert(res.error);
          } else {
            console.log("HEYYYYYYYYYYYYYYYYYY");
            window.location.href = "/myProfile";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const verificarUsuario = () => {
    fetch("http://localhost:3001/api/verificarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          console.log("HEYYYYYYYYYYYYYYYYYY");
          window.location.href = "/myProfile";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
          <div className="galeria-fotos flex justify-center">
            {userData.fotos.map((foto, index) => (
              <img
                key={index}
                src={`data:image/jpg;base64,${foto}`}
                className="w-[30%]"
              />
            ))}
            <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
              +
            </button>
          </div>
          <p>Tu edad es {userData.edad}</p>
          <p>
            Tu ubicacion es {userData.ciudad}, {userData.pais}
          </p>
          <p>Tu sexo es {userData.sexo}</p>
          <div className="flex flex-row justify-center">
            <p>Tu descripcion es {userData.descripcion}</p>{" "}
            <FaPen
              className="ml-2 text-[#13206a] cursor-pointer"
              onClick={editDescription}
            />
          </div>
          {userData.verificado ? (
            <div>
              <MdVerified className="text-black" />
              <p>Tu cuenta esta verificado</p>
            </div>
          ) : (
            <div className="flex flex-row justify-center">
              <p>Tu cuenta no esta verificado</p>
              <button
                className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
                onChange={verificarUsuario}
              >
                Verificar
              </button>
            </div>
          )}
          <div className="flex flex-row justify-center">
            <p>Tus hobbies son: {userData.hobbies}</p>
            <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
              +
            </button>
          </div>
          <div className="flex flex-row justify-center">
            <p>Tus certificaciones son: {userData.certificaciones}</p>
            <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
              +
            </button>
          </div>
          <div className="flex flex-row justify-center">
            <p>Tus habilidades son: {userData.habilidades}</p>
            <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
              +
            </button>
          </div>
          <div className="flex flex-row justify-center">
            <p>Tus orientaciones sexuales son: {userData.orientaciones}</p>
            <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
              +
            </button>
          </div>
          <p>Tus estudios son:</p>
          {userData.lista_instituciones.map((institucion, index) => (
            <div key={index}>
              <p>Estudiaste en {institucion.nombre}</p>
              {userData.lista_estudios[index].map((estudio, index) => (
                <div key={index}>
                  <p>
                    Titulo: {estudio.r_grado} de {estudio.r_especialidad}
                  </p>
                  <p>Desde {estudio.r_ano_ingreso}</p>
                  <p>Hasta {estudio.r_ano_egreso}</p>
                </div>
              ))}
              <div className="flex flex-row justify-center">
                <p>Estuviste en las siguientes agrupaciones:</p>
                {userData.lista_agrupaciones[index].map((agrupacion, index) => (
                  <div key={index}>
                    <p>{agrupacion.r_agrupacion}</p>
                  </div>
                ))}
                <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
                  +
                </button>
              </div>
            </div>
          ))}
          <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
            Agregar institucion
          </button>
          <p>Tus trabajos actuales son:</p>
          {userData.lista_trabajos.map((trabajo, index) => (
            <div key={index}>
              <p>Trabajas en {userData.lista_empresas[index].nombreEmpresa}</p>
              <p>Desde {trabajo.fecha_de_inicio}</p>
              <p>Como {trabajo.puesto}</p>
              <p>URL: {userData.lista_empresas[index].urlEmpresa}</p>
            </div>
          ))}
          <button className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
            Agregar un trabajo actual
          </button>
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

export default MyProfile;
