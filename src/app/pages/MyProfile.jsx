import { useEffect, useState } from "react";
import "../App.css";
import { FaPen } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Hobbies from "../components/Hobbies";
import CarouselImgs from "../components/CarouselImgs";
import Habilidades from "../components/Habilidades";
import Orientations from "../components/Orientaciones";
import validator from "validator";

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [base64Img, setBase64Img] = useState("");
  const [actualIndexPhoto, setActualIndexPhoto] = useState(0);
  const [showBotonAceptar, setShowBotonAceptar] = useState(false);
  const [agregarTitulo, setAgregarTitulo] = useState(false);
  const [agregarInstitucion, setAgregarInstitucion] = useState(false);
  const [grado, setGrado] = useState("Maestria");
  const [especialidad, setEspecialidad] = useState("");
  const [dominio, setDominio] = useState("");
  const [anio_inicio, setAnioInicio] = useState("");
  const [anio_fin, setAnioFin] = useState("");
  const [listaInstituciones, setListaInstituciones] = useState([]);
  const [agregarTrabajo, setAgregarTrabajo] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [puesto, setPuesto] = useState("");
  const [fecha_inicio_trabajo, setFechaInicio] = useState("");
  const [urlEmpresa, setUrl] = useState("");

  function getInstituciones() {
    fetch("http://localhost:3001/api/instituciones", {
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
        setListaInstituciones(data);
      })
      .catch((error) => {
        alert("Error 500 al obtener las instituciones: ", error);
      });
  }

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
          alert("Error 500 al editar descripcion: ", error);
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
        alert("Error 500 al verificar cuenta: ", error);
      });
  };

  const addCertificacion = () => {
    const certificacion = prompt("Escribe tu nueva certificacion");
    if (certificacion) {
      fetch("http://localhost:3001/api/addCertificacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ certificado: certificacion }),
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
          alert("Error 500 al agregar certificacion: ", error);
        });
    }
  };

  const deleteCertificado = (index) => {
    const JsonData = {
      r_certificacion: userData.certificaciones[index],
    };
    fetch("http://localhost:3001/api/deleteCertificado", {
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
        alert("Error 500 al eliminar certificado: ", error);
      });
  };

  const addAgrupacion = (dominio) => {
    const agrupacion = prompt("Escribe la agrupacion");
    if (agrupacion) {
      fetch("http://localhost:3001/api/addAgrupacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ dominio: dominio, agrupacion: agrupacion }),
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
          alert("Error 500 al agregar agrupacion: ", error);
        });
    }
  };

  const deleteAgrupacion = (dominio, agrupacion) => {
    const JsonData = {
      dominio: dominio,
      agrupacion: agrupacion,
    };
    fetch("http://localhost:3001/api/deleteAgrupacion", {
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
        alert("Error 500 al eliminar agrupacion: ", error);
      });
  };

  const addTitulo = () => {
    const JsonData = {
      dominio: dominio,
      grado: grado,
      especialidad: especialidad,
      anio_ingreso: anio_inicio,
      anio_egreso: anio_fin,
    };
    fetch("http://localhost:3001/api/addTitulo", {
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
        alert("Error 500 al agregar titulo: ", error);
      });
  };

  const deleteTitulo = (institucion, grado, especialidad) => {
    const JsonData = {
      dominio: institucion,
      grado: grado,
      especialidad: especialidad,
    };
    fetch("http://localhost:3001/api/deleteTitulo", {
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
        alert("Error 500 al eliminar titulo: ", error);
      });
  };

  const addEmpresa = () => {
    const JsonData = {
      empresa: empresa,
      puesto: puesto,
      fecha_inicio: fecha_inicio_trabajo,
      url: urlEmpresa,
    };
    fetch("http://localhost:3001/api/addEmpresa", {
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
        alert("Error 500 al agregar empresa: ", error);
      });
  };

  const deleteEmpresa = (index) => {
    const JsonData = {
      id_empresa: index,
    };
    fetch("http://localhost:3001/api/deleteEmpresa", {
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
        alert("Error 500 al eliminar empresa: ", error);
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
                imgs={Object.values(userData?.fotos?.map((foto) => foto.r_foto))}
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
                  className="ml-2 text-[#ffffff] cursor-pointer bg-[#13206a] text-3xl mt-2 p-1"
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
                    <MdVerified className="text-white ml-2" />
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
                  {userData.sexo === "Otro" && <span> Otro </span>}
                </p>
                <p>
                  En {userData.ciudad}, {userData.pais}
                </p>
              </div>
              <div className="flex flex-col ml-10">
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
          </div>
          <Hobbies saved_hobbies={userData.hobbies} className="mb-10" />
          <Habilidades
            saved_habilidades={userData.habilidades}
            className="mb-10"
          />
          <div className="flex flex-row">
            <div className="w-[300px] mr-10">
              <Orientations saved_orientations={userData.orientaciones} />
            </div>
            <div className="flex flex-col my-5 w-1/2 flex-1/2">
              <div className="flex flex-row justify-center">
                <p>Certificaciones:</p>{" "}
                <button
                  className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded w-10"
                  onClick={addCertificacion}
                >
                  +
                </button>
              </div>
              {userData.certificaciones.map((certificacion, index) => (
                <div key={index} className="flex flex-row justify-between">
                  <p>{certificacion}</p>{" "}
                  <FaTrashCan
                    className="ml-2 text-[#ffffff] cursor-pointer bg-[#13206a] text-2xl mt-1 p-1"
                    onClick={() => {
                      console.log("Eliminando certificado...");
                      deleteCertificado(index);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <div className="flex flex-row justify-center">
              <p>Estudios: </p>{" "}
              <button
                className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
                onClick={() => {
                  getInstituciones();
                  setAgregarInstitucion(true);
                }}
              >
                +
              </button>
            </div>
            {userData.lista_instituciones.map((institucion, index) => (
              <div key={index} className="flex flex-col justify-center">
                <div className="flex flex-row justify-center">
                  <p>Institución: {institucion.nombre}</p>{" "}
                  <button
                    className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
                    onClick={() => {
                      setAgregarTitulo(true);
                      setDominio(institucion.dominio);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="">
                  {userData.lista_estudios[index].map((estudio, index) => (
                    <div key={index} className="flex flex-col justify-center">
                      <div className="flex flex-row justify-center">
                        <p>
                          Titulo: {estudio.r_grado} de {estudio.r_especialidad}
                        </p>{" "}
                        <FaTrashCan
                          className="ml-2 text-[#ffffff] cursor-pointer bg-[#13206a] text-2xl p-1"
                          onClick={() => {
                            console.log("Eliminando titulo...");
                            deleteTitulo(
                              institucion.dominio,
                              estudio.r_grado,
                              estudio.r_especialidad
                            );
                          }}
                        />
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
                    <button
                      className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
                      onClick={() => {
                        addAgrupacion(institucion.dominio);
                      }}
                    >
                      +
                    </button>
                  </div>
                  {userData.lista_agrupaciones[index].map(
                    (agrupacion, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between w-[300px] self-center"
                      >
                        <p>{agrupacion.r_agrupacion}</p>
                        <FaTrashCan
                          className="ml-2 text-[#ffffff] cursor-pointer bg-[#13206a] text-2xl mt-1 p-1"
                          onClick={() => {
                            console.log("Eliminando agrupacion...");
                            deleteAgrupacion(
                              institucion.dominio,
                              agrupacion.r_agrupacion
                            );
                          }}
                        />
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
              <button
                className="bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
                onClick={() => {
                  console.log("Agregando trabajo...");
                  setAgregarTrabajo(true);
                }}
              >
                +
              </button>
            </div>
            {userData.lista_empresas.map((empresa, index) => (
              <div key={index} className="mb-5">
                <div className="flex flex-row justify-center ">
                  <p>Empresa: {empresa.nombreempresa}</p>
                  <FaTrashCan
                    className="ml-2 text-[#ffffff] cursor-pointer bg-[#13206a] text-2xl p-1"
                    onClick={() => {
                      console.log("Eliminando trabajo...", empresa.idempresa);
                      deleteEmpresa(empresa.idempresa);
                    }}
                  />
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
      {(agregarTitulo || agregarInstitucion) && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="flex flex-col bg-[#6260cd bg-opacity-80 p-10 w-[600px] rounded-lg">
            <div className="flex flex-col">
              {agregarInstitucion && (
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="institution"
                  >
                    Institución
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="institution"
                    onChange={async (e) => {
                      await setDominio(
                        listaInstituciones.find(
                          (institucion) =>
                            institucion.dominio === e.target.value
                        ).dominio
                      );
                    }}
                    value={dominio}
                    required
                  >
                    <option value="" disabled>
                      Seleccione una institución
                    </option>
                    {listaInstituciones.map((institucion, index) => (
                      <option key={index} value={institucion.dominio}>
                        {institucion.nombre + " - " + institucion.dominio}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="grade"
                >
                  Grado
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="grade"
                  onChange={(e) => setGrado(e.target.value)}
                  value={grado}
                  required
                >
                  <option value="Maestria">Maestría</option>
                  <option value="Master">Master</option>
                  <option value="Especializacion">Especialización</option>
                  <option value="Diplomado">Diplomado</option>
                  <option value="Doctorado">Doctorado</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="title"
                >
                  Especialidad
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Especialidad"
                  onChange={(e) => setEspecialidad(e.target.value)}
                  value={especialidad}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="start"
                  >
                    Año de ingreso
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    id="start"
                    type="number"
                    placeholder="Año de inicio"
                    onChange={(e) => setAnioInicio(e.target.value)}
                    value={anio_inicio}
                    min="1950"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                <div className="w-[1rem]"></div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="end"
                  >
                    Año de egreso
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    id="end"
                    type="number"
                    placeholder="Año de fin"
                    onChange={(e) => setAnioFin(e.target.value)}
                    value={anio_fin}
                    min="1950"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <button
                className="text-black border-2 border-black py-1 px-1 rounded-lg"
                onClick={() => {
                  setAgregarTitulo(false);
                  setGrado("Maestria");
                  setEspecialidad("");
                  setAnioInicio("");
                  setAnioFin("");
                  setAgregarInstitucion(false);
                }}
              >
                Cancelar
              </button>
              {especialidad !== "" &&
                (anio_fin !== "") & (anio_inicio !== "") && (
                  <button
                    className="text-black border-2 border-black py-1 px-1 rounded-lg"
                    onClick={addTitulo}
                  >
                    Aceptar
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
      {agregarTrabajo && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="flex flex-col bg-[#6260cd] bg-opacity-80 p-10 w-[600px] rounded-lg">
            <div className="flex flex-col">
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="company"
                >
                  Empresa
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="company"
                  type="text"
                  placeholder="Empresa"
                  onChange={(e) => setEmpresa(e.target.value)}
                  value={empresa}
                  required
                />
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="position"
                >
                  Puesto
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="position"
                  type="text"
                  placeholder="Puesto"
                  onChange={(e) => setPuesto(e.target.value)}
                  value={puesto}
                  required
                />
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="start"
                >
                  Fecha de inicio
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="start"
                  type="date"
                  placeholder="Fecha de inicio"
                  onChange={(e) => setFechaInicio(e.target.value)}
                  value={fecha_inicio_trabajo}
                  required
                />
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-white text-sm font-bold mb-2 text-left"
                  htmlFor="url"
                >
                  URL de la empresa
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  id="url"
                  type="text"
                  placeholder="URL de la empresa"
                  onChange={(e) => setUrl(e.target.value)}
                  value={urlEmpresa}
                  required
                />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button
                className="text-black border-2 border-black py-1 px-1 rounded-lg"
                onClick={() => {
                  setAgregarTrabajo(false);
                  setEmpresa("");
                  setPuesto("");
                  setFechaInicio("");
                  setUrl("");
                }}
              >
                Cancelar
              </button>
              {empresa !== "" &&
                (puesto !== "") & (fecha_inicio_trabajo !== "") &&
                validator.isURL(urlEmpresa) && (
                  <button
                    className="text-black border-2 border-black py-1 px-1 rounded-lg"
                    onClick={addEmpresa}
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
