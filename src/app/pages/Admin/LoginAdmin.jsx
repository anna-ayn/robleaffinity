import { useRef } from "react";
import "../../App.css";
import logo from "../../img/Logo.png";

export default function LoginAdmin() {
  const email = useRef();
  const contrasena = useRef();

  const LogIn = () => {
    const data = {
      email: email.current.value,
      contrasena_propuesta: contrasena.current.value,
    };

    fetch("http://localhost:3001/api/goToAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/AdminDashboard";
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
        alert("Error 500 al login admin: ", error);
      });
  };

  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <img
        src={logo}
        onClick={() => (window.location.href = "/")}
        className="self-stretch w-[80%] sm:w-[30%] m-auto cursor-pointer"
      />
      <div className="p-2 h-full w-full sm:w-[80%] bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <form className="p-2">
          <div className="flex flex-col">
            <h3>Sistema administrativo</h3>
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-white text-sm font-bold mb-2 text-left"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="email"
                ref={email}
                required
              />
            </div>
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-white text-sm font-bold mb-2 text-left"
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
          </div>
        </form>
      </div>
      <button className="pulse text-lg sm:text-xl p-2" onClick={LogIn}>
        Iniciar sesión
      </button>
    </div>
  );
}
