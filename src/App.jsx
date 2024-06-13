import './App.css'
import logo from './img/Logo.png'; 

function App() {

  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-[1000px]">
      <img
        src={logo}
        className="self-stretch w-full"
      />
      <div className="mt-10 leading-5 text-center">
        <h3 className="text-3xl">
          ¡Te damos la bienvenida a  <mark className="px-2 text-white bg-[#EA5B6E] rounded">RobleAffinity, el oasis para graduados</mark>!
        </h3>
        <div className="text-lg">
          <p>En RobleAffinity, nos enfocaremos en brindar una experiencia única y enriquecedora para aquellos que han superado la treintena y cuenten con título(s) universitario(s).</p>
          <p><mark className="px-2 text-white bg-[#EA5B6E] rounded">Prepárate para entrar en un mundo de infinitas posibilidades.</mark></p>
        </div>
      </div>
      <div className="justify-center items-center px-16 py-4 mt-7 w-full text-base font-semibold tracking-normal border border-white border-solid max-w-[332px] rounded-[67.179px]">
        CREAR UNA CUENTA
      </div>
      <div className="mt-7 text-sm leading-4 text-center underline">
        ¿Ya tienes una cuenta? Inicia sesión
      </div>
    </div>
  );
}

export default App
