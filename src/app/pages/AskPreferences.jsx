import "../App.css";
import { useState } from "react";
import MultiRangeSlider from "../components/multiRangeSlider/MultiRangeSlider";

function Home() {
  const [grado, setGrado] = useState(null);
  const [maxDistancia, setMaxDistancia] = useState(5);
  const [minEdad, setMinEdad] = useState(30);
  const [maxEdad, setMaxEdad] = useState(99);
  const [sexo, setSexo] = useState([]);
  const [orientacion, setOrientacion] = useState([]);

  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <div className="p-2 h-full w-full sm:w-[80%] bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <form className="p-2">
          <div className="flex flex-col">
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="grade"
              >
                Grado
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="grade"
                onChange={(e) => setGrado(e.target.value)}
                value={grado}
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
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="maxDistance"
              >
                Máxima distancia
              </label>
              <input
                id="inputMaxDistance"
                type="number"
                value={maxDistancia}
                onChange={(e) => setMaxDistancia(parseInt(e.target.value))}
                min="1"
                max="3000"
                className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="range"
                id="rangeMaxDistance"
                min="1"
                max="3000"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMaxDistancia(value);
                }}
                value={maxDistancia}
                className="accent-pink-400 w-full" // Change the color here
              />
            </div>
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="minAge"
              >
                Rango de edad
              </label>
              <MultiRangeSlider
                min={minEdad}
                max={maxEdad}
                setMin={setMinEdad}
                setMax={setMaxEdad}
              />
            </div>
            <div className="mt-[30px] mb-[15px] flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="genre"
              >
                Preferencia de género
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sexo"
                onChange={(e) => setSexo(e.target.value)}
                value={sexo}
                required
                multiple // Add the multiple attribute here
              >
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="mt-[30px] mb-[15px] flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="genre"
              >
                Preferencia de orientación sexual
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="gender"
                onChange={(e) => setOrientacion(e.target.value)} // Update the state setter function here
                value={orientacion} // Update the state value here
                required
                multiple // Add the multiple attribute here
              >
                <option value="Heterosexual">Heterosexual</option>
                <option value="Homosexual">Homosexual</option>
                <option value="Bisexual">Bisexual</option>
                <option value="Pansexual">Pansexual</option>
                <option value="Asexual">Asexual</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
