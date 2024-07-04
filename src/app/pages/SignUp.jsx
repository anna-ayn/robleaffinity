import "../App.css";
import logo from "../img/Logo.png";
import { useState, useEffect } from "react";
import ModalSuccess from "../components/ModalSuccess";
import validator from "validator";

export default function SignUp() {
  const [listaInstituciones, setListaInstituciones] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [sexo, setSexo] = useState("F");
  const [language, setLanguage] = useState("ESP");
  const [notifications, setNotifications] = useState("True");
  const [theme, setTheme] = useState("True");
  const [photosData, setPhotosData] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [anio_inicio, setAnioInicio] = useState("");
  const [anio_fin, setAnioFin] = useState("");
  const [dominio_institucion, setDominioInstitucion] = useState(null);
  const [cuentaCreadaExitosamente, setCuentaCreadaExitosamente] =
    useState(false);

  function handleNextPage() {
    // verificar que los campos estén llenos
    if (currentPage === 1) {
      if (
        nombre === "" ||
        apellido === "" ||
        fechaNacimiento == "" ||
        telefono === "" ||
        email === "" ||
        contrasena === ""
      ) {
        alert("Por favor, llene todos los campos");
        return;
      }

      if (!validator.isEmail(email)) {
        alert("Por favor, ingrese un correo electrónico válido");
        return;
      }

      if (!validator.isNumeric(telefono)) {
        alert("Por favor, ingrese un número de teléfono válido");
        return;
      }
    } else if (currentPage === 2) {
      if (
        dominio_institucion === null ||
        titulo === "" ||
        anio_inicio === "" ||
        anio_fin === ""
      ) {
        alert("Por favor, llene todos los campos");
        return;
      }
    } else if (currentPage === 3) {
      if (theme === null || language === null || notifications === null) {
        alert("Por favor, llene todos los campos");
        return;
      }
    } else if (currentPage === 4) {
      if (photosData === null) {
        alert("Por favor, suba una foto");
        return;
      }
    }

    setCurrentPage(currentPage + 1);
  }

  function handlePreviousPage() {
    setCurrentPage(currentPage - 1);
  }

  function handlePhotoChange(event) {
    const files = event.target.files;

    if (files.length === 0) {
      setPhotosData(null);
      return;
    }

    const fotosData = [];
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          fotosData.push(reader.result.split(",")[1]); // get base64 string
          resolve();
        };
        reader.readAsDataURL(files[i]);
      });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        setPhotosData(fotosData);
      })
      .catch((error) => {
        console.error("Error al cargar las fotos:", error);
      });
  }

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
          console.log("Latitude is :", latitude);
          console.log("Longitude is :", longitude);
        },
        (error) => {
          console.error(error);
          // Handle error if user denies permission or if there's an error retrieving the location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Handle case where geolocation is not supported
    }
  }, []);

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
          console.log(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
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
    getInstituciones();
  }, []);

  function handleSubmit() {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("fecha_nacimiento", fechaNacimiento);
    formData.append("telefono", telefono);
    formData.append("email", email);
    formData.append("contrasena", contrasena);
    formData.append("sexo", sexo);
    formData.append("idioma", language);
    formData.append("notificaciones", notifications);
    formData.append("tema", theme);
    formData.append("longitud", location.longitude);
    formData.append("latitud", location.latitude);
    for (let i = 0; i < photosData.length; i++) {
      formData.append("fotos[]", photosData[i]);
    }
    formData.append("dominio_institucion", dominio_institucion);
    formData.append("titulo", titulo);
    formData.append("anio_inicio", anio_inicio);
    formData.append("anio_fin", anio_fin);

    fetch("http://localhost:3001/api/cuentas", {
      method: "POST",
      headers: {
        Accept: "./multipart/form-data",
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Cuenta creada correctamente");
          setCuentaCreadaExitosamente(true);
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
        alert("Error 500 al crear la cuenta: ", error);
      });
  }

  return (
    <div className="flex flex-col items-center mx-auto w-full h-full font-medium text-white max-w-auto">
      <img
        src={logo}
        onClick={() => (window.location.href = "/")}
        className="self-stretch w-[80%] sm:w-[30%] m-auto cursor-pointer"
      />
      <h3 className="text-xl sm:text-lg mb-5">
        🌍 Conectando experiencias y sabiduría:{" "}
        {window.innerWidth < 600 ? <br /> : ""}
        <mark className="px-1 rounded text-2xl sm:text-xl">
          Tu pareja ideal te espera 💖
        </mark>
        .
      </h3>
      <div className="h-full w-full bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-100">
        <form className="p-5 flex flex-col justify-between h-full">
          {currentPage == 1 && (
            <div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="name"
                  >
                    Nombre
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Nombre"
                    onChange={(e) => setNombre(e.target.value)}
                    value={nombre}
                    required
                  />
                </div>
                <div className="w-[1rem]"></div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="surname"
                  >
                    Apellido
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="surname"
                    type="text"
                    placeholder="Apellido"
                    onChange={(e) => setApellido(e.target.value)}
                    value={apellido}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="gender"
                  >
                    Sexo
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="gender"
                    onChange={(e) => setSexo(e.target.value)}
                    value={sexo}
                    required
                  >
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="w-[1rem]"></div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="birthdate"
                  >
                    Fecha de Nacimiento
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                    id="birthdate"
                    type="date"
                    placeholder="Fecha de Nacimiento"
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    value={fechaNacimiento}
                    required
                  />
                </div>
                <div className="w-[1rem]"></div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="phone"
                  >
                    Teléfono
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="tel"
                    placeholder="Teléfono"
                    onChange={(e) => setTelefono(e.target.value)}
                    value={telefono}
                    required
                  />
                </div>
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-left"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="hola@ejemplo.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-left"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="********"
                  onChange={(e) => setContrasena(e.target.value)}
                  value={contrasena}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-[#ff8787] hover:bg-[#fab6b6] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleNextPage}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {currentPage === 2 && (
            <div>
              <div>
                <h3 className="text-gray-700 font-bold">
                  Selecciona una institución que has estudiado
                </h3>
              </div>
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
                    await setDominioInstitucion(
                      listaInstituciones.find(
                        (institucion) => institucion.dominio === e.target.value
                      ).dominio
                    );
                  }}
                  value={dominio_institucion}
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
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-left"
                  htmlFor="title"
                >
                  Título
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Título"
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="start"
                  >
                    Año de ingreso
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="end"
                  >
                    Año de egreso
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handlePreviousPage}
                >
                  Atrás
                </button>
                <button
                  className="bg-[#ff8787] hover:bg-[#fab6b6] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleNextPage}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {currentPage === 3 && (
            <div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-left"
                  htmlFor="theme"
                >
                  Tema
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="theme"
                  onChange={(e) => setTheme(e.target.value)}
                  value={theme}
                  required
                >
                  <option value="True">Claro</option>
                  <option value="False">Oscuro</option>
                </select>
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-left"
                  htmlFor="language"
                >
                  Idioma
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="language"
                  onChange={(e) => setLanguage(e.target.value)}
                  value={language}
                  required
                >
                  <option value="ESP">Español</option>
                  <option value="ENG">Inglés</option>
                </select>
              </div>
              <div className="mb-[15px] flex-grow">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 text-left"
                  htmlFor="notifications"
                >
                  Notificaciones
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="notifications"
                  onChange={(e) => setNotifications(e.target.value)}
                  value={notifications}
                  required
                >
                  <option value="True">Activadas</option>
                  <option value="False">Desactivadas</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handlePreviousPage}
                >
                  Atrás
                </button>
                <button
                  className="bg-[#ff8787] hover:bg-[#fab6b6] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleNextPage}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {currentPage === 4 && (
            <div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="photo"
                  >
                    Sube una o varias fotos para tu perfil
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    multiple={true}
                    required
                  />
                  {photosData && (
                    <div className="flex flex-wrap">
                      {Array.from(photosData).map((photo, index) => (
                        <img
                          key={index}
                          src={`data:image/jpg;base64,${photo}`}
                          className="w-[20%] m-auto"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handlePreviousPage}
                >
                  Atrás
                </button>
                <button
                  className="pulse  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleSubmit}
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      {cuentaCreadaExitosamente && (
        <ModalSuccess
          title="¡Cuenta creada exitosamente!"
          message="Tu cuenta ha sido creada exitosamente. ¡Bienvenido a la comunidad!"
        />
      )}
    </div>
  );
}
