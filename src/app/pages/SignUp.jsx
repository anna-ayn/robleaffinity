import "../App.css";
import logo from "../img/Logo.png";
import { useState, useRef, useEffect } from "react";

export default function SignUp() {
  const [currentPage, setCurrentPage] = useState(1);
  const nombre = useRef();
  const apellido = useRef();
  const fechaNacimiento = useRef();
  const telefono = useRef();
  const email = useRef();
  const contrasena = useRef();
  const sexo = useRef();
  const language = useRef();
  const notifications = useRef();
  const theme = useRef();

  const [nombreValor, setNombreValor] = useState("");
  const [apellidoValor, setApellidoValor] = useState("");
  const [fechaNacimientoValor, setFechaNacimientoValor] = useState("");
  const [telefonoValor, setTelefonoValor] = useState("");
  const [emailValor, setEmailValor] = useState("");
  const [contrasenaValor, setContrasenaValor] = useState("");
  const [sexoValor, setSexoValor] = useState("");
  const [languageValor, setLanguageValor] = useState("");
  const [notificationsValor, setNotificationsValor] = useState("");
  const [themeValor, setThemeValor] = useState("");

  const [photo, setPhoto] = useState(null);

  function handleNextPage() {
    if (currentPage === 1) {
      setNombreValor(nombre.current.value);
      setApellidoValor(apellido.current.value);
      setFechaNacimientoValor(fechaNacimiento.current.value);
      setTelefonoValor(telefono.current.value);
      setEmailValor(email.current.value);
      setContrasenaValor(contrasena.current.value);
      setSexoValor(sexo.current.value);
    } else if (currentPage === 2) {
      setLanguageValor(language.current.value);
      setNotificationsValor(notifications.current.value);
      setThemeValor(theme.current.value);
    }
    setCurrentPage(currentPage + 1);
  }

  function handlePreviousPage() {
    setCurrentPage(currentPage - 1);
  }

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    setPhoto(file);
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

  function handleSubmit() {
    console.log(languageValor);
    fetch("http://localhost:3001/api/cuentas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombreValor,
        apellido: apellidoValor,
        fecha_nacimiento: fechaNacimientoValor,
        telefono: telefonoValor,
        email: emailValor,
        contrasena: contrasenaValor,
        sexo: sexoValor,
        idioma: languageValor,
        notificaciones: notificationsValor,
        tema: themeValor,
        longitud: location.longitude,
        latitud: location.latitude,
        foto: photo,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Cuenta creada correctamente");
          return response.text();
        } else {
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
          {currentPage === 1 && (
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
                    ref={nombre}
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
                    ref={apellido}
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
                    ref={sexo}
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
                    ref={fechaNacimiento}
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
                    ref={telefono}
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
                  ref={email}
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
                  ref={contrasena}
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
                  ref={theme}
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
                  ref={language}
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
                  ref={notifications}
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
          {currentPage === 3 && (
            <div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 text-left"
                    htmlFor="photo"
                  >
                    Sube una foto para tu perfil
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    required
                  />
                </div>
                {photo && (
                  <div className="flex justify-center mt-5">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Uploaded Photo"
                      className="max-w-[200px] max-h-[200px]"
                    />
                  </div>
                )}
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
    </div>
  );
}
