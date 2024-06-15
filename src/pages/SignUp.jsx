import "../App.css";
import logo from "../img/Logo.png";
function SignUp() {
  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <img src={logo} className="self-stretch w-[30%] m-auto" />
      <h3 className="text-3xl mb-5">
        🌍 Conectando experiencias y sabiduría:{"  "}
        <mark className="px-2 rounded text-4xl">
          Tu pareja ideal te espera 💖
        </mark>
        .
      </h3>
      <div className="p-5 h-full w-full bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <form className="px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-row">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Username"
              />
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="surname"
                >
                  Apellido
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="surname"
                  type="text"
                  placeholder="Username"
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
