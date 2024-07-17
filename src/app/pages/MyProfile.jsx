import { useEffect, useState } from "react";
import "../App.css";
import { FaPen } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Hobbies from "../components/Hobbies";
import CarouselImgs from "../components/CarouselImgs";

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
            window.location.href = "/myProfile";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const verificarUsuario = () => {
    console.log("verificando...");
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
          window.location.href = "/myProfile";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Sidebar />
      {userData ? (
        <div className="bg-[#996ff242] backdrop-blur-xl shadow-xl  sm:ml-64 p-10">
          <div className="flex flex-col sm:flex-row">
            <div className="flex w-1/3 h-full">
              <CarouselImgs imgs={userData.fotos} base64={true} />
              <button className="bg-[#13206a] h-8 hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded">
                +
              </button>
            </div>
            <div className="w-2/3 mb-5">
              <div className="flex flex-row items-center justify-center">
                <p>
                  {userData.nombre} {userData.apellido}
                </p>
                <div className="flex items-center">
                  {userData.verificado ? (
                    <MdVerified className="text-black ml-2" />
                  ) : (
                    <button
                      className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded text-sm"
                      onClick={verificarUsuario}
                    >
                      Verificar
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <p>Edad: {userData.edad}</p>
                <p>
                  Sexo: {userData.sexo === "F" && <span> Femenino </span>}{" "}
                  {userData.sexo === "M" && <span> Masculino </span>}
                </p>
                <p>
                  En {userData.ciudad}, {userData.pais}
                </p>
              </div>
              <div className="flex flex-row">
                <p>Descripción:</p>
                <FaPen
                  className="ml-2 text-[#13206a] cursor-pointer"
                  onClick={editDescription}
                />
              </div>
              <p className="text-sm text-left">{userData.descripcion}</p>
            </div>
          </div>
          <Hobbies saved_hobbies={userData.hobbies} />
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
    </>
  );
}

export default MyProfile;
