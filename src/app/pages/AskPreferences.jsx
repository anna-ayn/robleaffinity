import "../App.css";
import { useState } from "react";
import MultiRangeSlider from "../components/multiRangeSlider/MultiRangeSlider";
import MultiSelect from "../components/MultiSelect";

function Home() {
  const [grado, setGrado] = useState("null");
  const [maxDistancia, setMaxDistancia] = useState(5);
  const [minEdad, setMinEdad] = useState(30);
  const [maxEdad, setMaxEdad] = useState(99);
  const [sexo, setSexo] = useState([]);
  const [orientacion, setOrientacion] = useState([]);

  const genreOptions = [
    { value: "F", label: "Femenino" },
    { value: "M", label: "Masculino" },
    { value: "Otro", label: "Otro" },
  ];

  const orientationOptions = [
    { value: "Heterosexual", label: "Heterosexual" },
    { value: "Gay", label: "Gay" },
    { value: "Lesbiana", label: "Lesbiana" },
    { value: "Bisexual", label: "Bisexual" },
    { value: "Asexual", label: "Asexual" },
    { value: "Demisexual", label: "Demisexual" },
    { value: "Pansexual", label: "Pansexual" },
    { value: "Queer", label: "Queer" },
    { value: "Cuestionamiento", label: "Cuestionamiento" },
    { value: "Buscando Chamba", label: "Buscando Chamba" },
    { value: "Otro", label: "Otro" },
  ];

  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <div className="p-2 h-full w-[350px]  bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <h3>Ajusta tus preferencias</h3>
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
                <option value="null">Ninguno</option>
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
                min={30}
                max={99}
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

              <MultiSelect options={genreOptions} name="genre" fun={setSexo} />
            </div>
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-left"
                htmlFor="orientation"
              >
                Preferencia de orientación sexual
              </label>
              <MultiSelect
                options={orientationOptions}
                name="orientation"
                fun={setOrientacion}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
