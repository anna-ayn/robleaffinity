import { useEffect, useState } from "react";
import "../App.css";
import { FaPen } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Hobbies from "../components/Hobbies";
import CarouselImgs from "../components/CarouselImgs";
import Habilidades from "../components/Habilidades";

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [base64Img, setBase64Img] = useState("");
  const [actualIndexPhoto, setActualIndexPhoto] = useState(0);
  const [showBotonAceptar, setShowBotonAceptar] = useState(false);

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

  const addANewPhoto = () => {
    setShowAddPhoto(true);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    console.log("next");

    reader.onload = function () {
      setBase64Img(reader.result.replace("data:", "").replace(/^.+,/, ""));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoAdd = () => {
    console.log("Subiendo foto...", base64Img);
    const formData = new FormData();
    formData.append("photo", base64Img);
    fetch("http://localhost:3001/api/addPhoto", {
      method: "POST",
      headers: {
        Accept: "./multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/myProfile";
          return response.text();
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
          console.log(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
        }
      })
      .catch((error) => {
        alert("Error 500 al subir la foto: ", error);
      });
  };

  const handlePhotoDelete = () => {
    const JsonData = {
      r_id_foto: userData.fotos[actualIndexPhoto].r_id_foto,
    };
    fetch("http://localhost:3001/api/deletePhoto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(JsonData),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/myProfile";
          return response.text();
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });
          alert(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
        }
      })
      .catch((error) => {
        alert("Error 500 al eliminar la foto: ", error);
      });
  };

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
              <CarouselImgs
                imgs={Object.values(userData.fotos.map((foto) => foto.r_foto))}
                base64={true}
                setIdx={setActualIndexPhoto}
              />
              <div>
                <button
                  className="bg-[#13206a] h-8 hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
                  onClick={addANewPhoto}
                >
                  +
                </button>
                <FaTrashCan
                  className="ml-2 text-[#ffffff] cursor-pointer bg-[#13206a] text-2xl mt-2"
                  onClick={() => {
                    console.log("Eliminando foto...", actualIndexPhoto);
                    handlePhotoDelete();
                  }}
                />
              </div>
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
          <Habilidades saved_habilidades={userData.habilidades} />
          <div className="flex flex-row justify-center">
            <p>Tus certificaciones son: {userData.certificaciones}</p>
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
      {showAddPhoto && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded">
            <label
              className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Sube una nueva foto
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  handlePhotoUpload(e);
                  setShowBotonAceptar(true);
                } else setShowBotonAceptar(false);
              }}
            />
            <div className="flex justify-between mt-2">
              <button
                className="text-black border-2 border-black py-1 px-1 rounded-lg"
                onClick={() => {
                  setShowAddPhoto(false);
                  setBase64Img("");
                  setShowBotonAceptar(false);
                }}
              >
                Cancelar
              </button>
              {showBotonAceptar && (
                <button
                  className="text-black border-2 border-black py-1 px-1 rounded-lg"
                  onClick={handlePhotoAdd}
                >
                  Aceptar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyProfile;
