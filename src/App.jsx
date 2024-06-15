import "./App.css";
import logo from "./img/Logo.png";

function App() {
  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <img src={logo} className="self-stretch w-[70%] m-auto" />
      <div className="p-5 h-full w-full bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <h3 className="text-3xl mb-5">
          ¡Te damos la bienvenida a{" "}
          <mark className="px-2 rounded text-4xl">
            RobleAffinity, el oasis para graduados
          </mark>
          !
        </h3>
        <div className="text-xl">
          <p className="mb-3">
            En RobleAffinity, nos enfocaremos en brindar una experiencia única y
            enriquecedora para aquellos que han superado la treintena y cuenten
            con título(s) universitario(s).
          </p>
          <p>
            <mark className="text-3xl px-2 rounded">
              Prepárate para entrar en un mundo de infinitas posibilidades.
            </mark>
          </p>
        </div>
      </div>
      <div className="justify-center items-center px-16 py-4 mt-7 w-full text-base font-semibold tracking-normal border border-white border-solid max-w-[332px] rounded-[67.179px]">
        CREAR UNA CUENTA
      </div>
      <div className="mt-7 text-xl leading-4 text-center underline">
        ¿Ya tienes una cuenta? Inicia sesión
      </div>
    </div>
  );
}

export default App;
