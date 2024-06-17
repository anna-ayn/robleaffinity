import "../App.css";
import logo from "../img/Logo.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goRegister = () => {
    navigate("/sign-up");
  };
  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <img
        src={logo}
        onClick={() => (window.location.href = "/")}
        className="self-stretch w-[80%] sm:w-[30%] m-auto cursor-pointer"
      />
      <div className="p-2 h-full w-full sm:w-[80%] bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <h3 className="text-xl sm:text-2xl mb-5">
          ¡Te damos la bienvenida a{" "}
          <mark className="px-2 rounded text-2xl sm:text-3xl">
            RobleAffinity, el oasis para graduados
          </mark>
          !
        </h3>
        <div className="text-sm sm:text-xl">
          <p className="mb-3">
            En RobleAffinity, nos enfocaremos en brindar una experiencia única y
            enriquecedora para aquellos que han superado la treintena y cuenten
            con título(s) universitario(s).
          </p>
          <p>
            <mark className="text-xl sm:text-2xl px-2 rounded">
              Prepárate para entrar en un mundo de infinitas posibilidades.
            </mark>
          </p>
        </div>
      </div>
      <button className="pulse text-lg sm:text-xl p-2" onClick={goRegister}>
        Crear una cuenta
      </button>
      <div className="mt-7 text-m leading-4 text-center underline">
        ¿Ya tienes una cuenta? Inicia sesión
      </div>
    </div>
  );
}

export default Home;
