import { useEffect, useState } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import CarouselImgs from "../components/CarouselImgs";
import { MdVerified } from "react-icons/md";
import PropTypes from "prop-types";

function MyProfile({ id_usuario }) {
  MyProfile.propTypes = {
    id_usuario: PropTypes.number.isRequired,
  };

  const [userData, setUserData] = useState(null);
  const [actualIndexPhoto, setActualIndexPhoto] = useState(0);

  const getAnotherUserData = (id_usuario) => {
    fetch(`/api/getAnotherUserData?id_usuario=${id_usuario}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
        }
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        alert("Error 500 al obtener los datos del usuario: ", error);
      });
  };

  useEffect(() => {
    getAnotherUserData(id_usuario);
  }, [id_usuario]);

  return (
    <>
      <Sidebar />
      {userData ? (
        <div className="bg-[#996ff242] backdrop-blur-xl shadow-xl  sm:ml-64 p-10">
          <div className="flex flex-col sm:flex-row">
            <div className="flex w-1/3 h-full">
              <CarouselImgs
                imgs={Object.values(userData.fotos.map((foto) => foto.r_foto))}
                base64={true}
                setIdx={setActualIndexPhoto}
              />
            </div>
            <div className="w-2/3 mb-5">
              <div className="flex flex-row items-center justify-center">
                <p>
                  {userData.nombre} {userData.apellido}
                </p>
                <div className="flex items-center">
                  {userData.verificado ? (
                    <MdVerified className="text-white ml-2" />
                  ) : (
                    <p>Perfil no verificado</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <p>Edad: {userData.edad}</p>
                <p>
                  Sexo: {userData.sexo === "F" && <span> Femenino </span>}{" "}
                  {userData.sexo === "M" && <span> Masculino </span>}
                  {userData.sexo === "Otro" && <span> Otro </span>}
                </p>
                <p>
                  En {userData.ciudad}, {userData.pais}
                </p>
              </div>
              <div className="flex flex-col ml-10">
                <div className="flex flex-row">
                  <p>Descripción:</p>
                </div>
                <p className="text-sm text-left">{userData.descripcion}</p>
              </div>
            </div>
          </div>
          <div className="mr-10">
            <div className="flex flex-row justify-center">
              <p>Hobbies:</p>{" "}
            </div>
            {userData.hobbies.map((hobbie, index) => (
              <div key={index} className="flex flex-row justify-between">
                <p>{hobbie}</p>{" "}
              </div>
            ))}
          </div>
          <div className="flex flex-col my-5 w-1/2 flex-1/2">
            <div className="flex flex-row justify-center">
              <p>Habilidades:</p>{" "}
            </div>
            {userData.habilidades.map((habilidad, index) => (
              <div key={index} className="flex flex-row justify-between">
                <p>{habilidad}</p>{" "}
              </div>
            ))}
          </div>
          <div className="flex flex-row">
            <div className="w-[300px] mr-10">
              <div className="flex flex-row justify-center">
                <p>Orientaciones sexuales:</p>{" "}
              </div>
              {userData.orientaciones.map((orientaciones, index) => (
                <div key={index} className="flex flex-row justify-between">
                  <p>{orientaciones}</p>{" "}
                </div>
              ))}
            </div>
            <div className="flex flex-col my-5 w-1/2 flex-1/2">
              <div className="flex flex-row justify-center">
                <p>Certificaciones:</p>{" "}
              </div>
              {userData.certificaciones.map((certificacion, index) => (
                <div key={index} className="flex flex-row justify-between">
                  <p>{certificacion}</p>{" "}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <div className="flex flex-row justify-center">
              <p>Estudios: </p>{" "}
            </div>
            {userData.lista_instituciones.map((institucion, index) => (
              <div key={index} className="flex flex-col justify-center">
                <div className="flex flex-row justify-center">
                  <p>Institución: {institucion.nombre}</p>{" "}
                </div>
                <div className="">
                  {userData.lista_estudios[index].map((estudio, index) => (
                    <div key={index} className="flex flex-col justify-center">
                      <div className="flex flex-row justify-center">
                        <p>
                          Titulo: {estudio.r_grado} de {estudio.r_especialidad}
                        </p>{" "}
                      </div>
                      <p>
                        Desde {estudio.r_ano_ingreso} hasta{" "}
                        {estudio.r_ano_egreso}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center mb-5">
                  <div className="flex flex-row justify-center mt-1">
                    <p>Agrupaciones:</p>{" "}
                  </div>
                  {userData.lista_agrupaciones[index].map(
                    (agrupacion, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between w-[300px] self-center"
                      >
                        <p>{agrupacion.r_agrupacion}</p>{" "}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <div className="flex flex-row justify-center mb-2">
              <p>Trabajos actuales: </p>{" "}
            </div>
            {userData.lista_empresas.map((empresa, index) => (
              <div key={index} className="mb-5">
                <div className="flex flex-row justify-center ">
                  <p>Empresa: {empresa.nombreempresa}</p>
                </div>
                <p>
                  Desde {userData.lista_trabajos[index].fecha_de_inicio},
                  trabaja como {userData.lista_trabajos[index].puesto}.
                </p>
                <p>URL de la empresa: {empresa.urlempresa}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
}

export default MyProfile;
