import "../App.css";
import { useEffect, useState } from "react";
import MultiRangeSlider from "../components/multiRangeSlider/MultiRangeSlider";
import MultiSelect from "../components/MultiSelect";
import PropTypes from "prop-types";
import validator from "validator";

function AskPreferences({ firstTime, inSettings = false }) {
  AskPreferences.propTypes = {
    firstTime: PropTypes.bool,
    inSettings: PropTypes.bool,
  };

  const [grado, setGrado] = useState("");
  const [maxDistancia, setMaxDistancia] = useState(5);
  const [minEdad, setMinEdad] = useState(30);
  const [maxEdad, setMaxEdad] = useState(99);
  const [sexo, setSexo] = useState([]);
  const [orientacion, setOrientacion] = useState([]);
  const [userWithPassport, setUserWithPassport] = useState(false);
  const [latitud_origen, setLatitudOrigen] = useState(0);
  const [longitud_origen, setLongitudOrigen] = useState(0);
  const [thereisdata, setThereisdata] = useState(false);
  const [userHasPreference, setUserHasPreference] = useState(false);

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

  const getPreferences = () => {
    fetch("http://localhost:3001/api/getPreferences", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGrado(data.grado);
        setMaxDistancia(data.maxDistancia);
        setMinEdad(data.minEdad);
        setMaxEdad(data.maxEdad);
        setSexo(data.prefSexos);
        setOrientacion(data.prefOrientaciones);
        setLatitudOrigen(data.latitud_origen);
        setLongitudOrigen(data.longitud_origen);
        setThereisdata(true);
        setUserWithPassport(data.tiene_passport);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (!firstTime) {
      getPreferences();
    } else {
      setSexo([""]);
      setOrientacion([""]);
    }
  }, []);

  const onSave = () => {
    const dataJSON = {
      estudio: grado,
      distancia_maxima: maxDistancia,
      min_edad: minEdad,
      max_edad: maxEdad,
      arr_prefSexos: sexo,
      arr_prefOrientaciones: orientacion,
      latitud_origen: firstTime ? latitud_origen : null,
      longitud_origen: firstTime ? longitud_origen : null,
    };
    if ((firstTime && !thereisdata) || !userHasPreference || !inSettings) {
      fetch("http://localhost:3001/api/insertPreferences", {
        method: "POST",
        headers: {
          Accept: "./multipart/form-data",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataJSON),
      })
        .then((response) => {
          if (response.ok) {
            alert("Preferencias guardadas con exito");
            window.location.href = "/dashboard";
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
          alert("Error 500 al guardar las preferencias: ", error);
        });
    } else {
      /*if (
        latitude && longitud && !validator.isLatLong(latitud_origen, longitud_origen) &&
        userWithPassport
      ) {
        alert("Las coordenadas no son validas");
        return;
      }*/
      fetch("http://localhost:3001/api/updatePreferences", {
        method: "POST",
        headers: {
          Accept: "./multipart/form-data",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataJSON),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Preferencias guardadas con exito");
            alert("Preferencias guardadas con exito");
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
          alert("Error 500 al guardar las preferencias: ", error);
        });
    }
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/checkIfUserHasPreferences",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.hasPreferences === true) {
          setUserHasPreference(true);
        }
        setThereisdata(true);
      } catch (error) {
        console.log(error);
        alert("Error 500 al obtener la informacion de la cuenta: ", error);
      }
    };

    fetchUserPreferences();
  }, []);

  if (!thereisdata && !firstTime && !inSettings) {
    return <div>Cargando preferencias...</div>;
  }

  return (
    <div className="flex flex-col items-center mx-auto w-full font-medium text-white max-w-auto">
      <div className="p-2 h-full w-[350px]  bg-red-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
        <h3>Ajusta tus preferencias</h3>
        <form className="p-2">
          <div className="flex flex-col">
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-white text-sm font-bold mb-2 text-left"
                htmlFor="grade"
              >
                Grado
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                id="grade"
                onChange={(e) => setGrado(e.target.value)}
                value={grado}
              >
                <option value="">Ninguno</option>
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
                className="block text-white text-sm font-bold mb-2 text-left"
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
                className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
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
                className="block text-white text-sm font-bold mb-2 text-left"
                htmlFor="minAge"
              >
                Rango de edad
              </label>
              <div className="mb-[30px]">
                <MultiRangeSlider
                  min={30}
                  max={99}
                  setMin={setMinEdad}
                  setMax={setMaxEdad}
                  actualMin={minEdad}
                  actualMax={maxEdad}
                />
              </div>
            </div>
            {userWithPassport && (
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="latitud"
                  >
                    Latitud de origen
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="latitud"
                    type="text"
                    placeholder="10.00000000"
                    onChange={(e) => setLatitudOrigen(e.target.value)}
                    value={latitud_origen}
                    required
                  />
                </div>
                <div className="w-[1rem]"></div>
                <div className="mb-[15px] flex-grow">
                  <label
                    className="block text-white text-sm font-bold mb-2 text-left"
                    htmlFor="longitud"
                  >
                    Longitud de origen
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="longitud"
                    type="text"
                    placeholder="-10.00000000"
                    onChange={(e) => setLongitudOrigen(e.target.value)}
                    value={longitud_origen}
                    required
                  />
                </div>
              </div>
            )}
            <div className="mb-[15px] flex-grow">
              <label
                className="block text-white text-sm font-bold mb-2 text-left"
                htmlFor="genre"
              >
                Preferencia de género
              </label>

              <MultiSelect
                options={genreOptions}
                name="genre"
                fun={setSexo}
                saved={sexo}
              />
            </div>

            <div className="mb-[15px] flex-grow">
              <label
                className="block text-white text-sm font-bold mb-2 text-left"
                htmlFor="orientation"
              >
                Preferencia de orientación sexual
              </label>
              <MultiSelect
                options={orientationOptions}
                name="orientation"
                fun={setOrientacion}
                saved={orientacion}
              />
            </div>
          </div>
          <button
            className="pulse text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onSave}
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskPreferences;
