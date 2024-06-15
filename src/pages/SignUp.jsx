import "../App.css";
import logo from "../img/Logo.png";

function SignUp() {
  return (
    <div className="flex flex-col items-center mx-auto w-full h-full font-medium text-white max-w-auto">
      <img src={logo} className="self-stretch w-[30%] m-auto" />
      <h3 className="text-lg mb-5">
        🌍 Conectando experiencias y sabiduría:{" "}
        <mark className="px-1 rounded text-xl">
          Tu pareja ideal te espera 💖
        </mark>
        .
      </h3>
      <div className="p-5 h-full w-full bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <form className="px-8 pt-6 pb-8 mb-4 flex flex-col justify-between h-full">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 flex-grow">
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
                required
              />
            </div>
            <div className="w-[1rem]"></div>
            <div className="mb-4 flex-grow">
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
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="birthdate"
              >
                Fecha de Nacimiento
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="birthdate"
                type="date"
                placeholder="Fecha de Nacimiento"
                required
              />
            </div>
            <div className="w-[1rem]"></div>
            <div className="mb-4 flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="phone"
              >
                Teléfono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="tel"
                placeholder="Teléfono"
                required
              />
            </div>
          </div>
          <div className="mb-4 flex-grow">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="hola@ejemplo.com"
              required
            />
          </div>
          <div className="mb-4 flex-grow">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
