import "../App.css";
import logo from "../img/Logo.png";
import { useRef } from "react";

function SignUp() {
  const nombre = useRef();
  const apellido = useRef();
  const fechaNacimiento = useRef();
  const telefono = useRef();
  const email = useRef();
  const contrasena = useRef();

  function handleSubmit() {
    fetch("http://localhost:3001/cuentas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre.current.value,
        apellido: apellido.current.value,
        fecha_nacimiento: fechaNacimiento.current.value,
        telefono: telefono.current.value,
        email: email.current.value,
        contrasena: contrasena.current.value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Error al crear la cuenta");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error al crear la cuenta");
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
        </form>
      </div>
      <button className="pulse text-lg sm:text-xl p-2" onClick={handleSubmit}>
        Crear cuenta
      </button>
    </div>
  );
}

export default SignUp;
