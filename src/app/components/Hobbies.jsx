import "../App.css";
import { useState } from "react";
import MultiSelect from "../components/MultiSelect";
import PropTypes from "prop-types";

export default function AskPreferences({ saved_hobbies }) {
  AskPreferences.propTypes = {
    saved_hobbies: PropTypes.array.isRequired,
  };

  const [hobbies, setHobbies] = useState([]);
  const HobbiesOptions = [
    { value: "Estudiar", label: "Estudiar" },
    { value: "Programar", label: "Programar" },
    { value: "Futbol", label: "Futbol" },
    { value: "Escalar", label: "Escalar" },
    { value: "Pescar", label: "Pescar" },
    { value: "Fotografias", label: "Fotografias" },
    { value: "Trabajar como voluntario", label: "Trabajar como voluntario" },
    { value: "Comedia", label: "Comedia" },
    { value: "Cafe", label: "Cafe" },
    { value: "Comer", label: "Comer" },
    { value: "Disney", label: "Disney" },
    { value: "Amante de los animales", label: "Amante de los animales" },
    { value: "Amante de los gatos", label: "Amante de los gatos" },
    { value: "Amante de los perros", label: "Amante de los perros" },
    { value: "Caminar", label: "Caminar" },
    { value: "Cocinar", label: "Cocinar" },
    { value: "Al aire libre", label: "Al aire libre" },
    { value: "Baile", label: "Baile" },
    { value: "Picnic", label: "Picnic" },
    { value: "Juegos de mesa", label: "Juegos de mesa" },
    { value: "Cantar", label: "Cantar" },
    { value: "Compras", label: "Compras" },
    { value: "Hacer ejercicios", label: "Hacer ejercicios" },
    { value: "Deportes", label: "Deportes" },
    { value: "Hornear", label: "Hornear" },
    { value: "Jardineria", label: "Jardineria" },
    { value: "Lectura", label: "Lectura" },
    { value: "Jugar videojuegos", label: "Jugar videojuegos" },
    { value: "Peliculas", label: "Peliculas" },
    { value: "Arte", label: "Arte" },
    { value: "Blogs", label: "Blogs" },
    { value: "Yoga", label: "Yoga" },
    { value: "Correr", label: "Correr" },
    { value: "Golf", label: "Golf" },
    { value: "Espiritualidad", label: "Espiritualidad" },
    { value: "Tomar una copa", label: "Tomar una copa" },
    { value: "Viajar", label: "Viajar" },
    { value: "Nadar", label: "Nadar" },
    { value: "Manualidades", label: "Manualidades" },
    { value: "Senderismo", label: "Senderismo" },
    { value: "Astrologia", label: "Astrologia" },
    { value: "Redes sociales", label: "Redes sociales" },
    { value: "Musica", label: "Musica" },
    { value: "Museo", label: "Museo" },
    { value: "Vino", label: "Vino" },
    { value: "Gastronomia", label: "Gastronomia" },
    { value: "Escribir", label: "Escribir" },
    { value: "Intercambio de idiomas", label: "Intercambio de idiomas" },
    { value: "Vlogging", label: "Vlogging" },
    { value: "Naturaleza", label: "Naturaleza" },
    { value: "Netflix", label: "Netflix" },
    { value: "Kpop", label: "Kpop" },
    { value: "Surf", label: "Surf" },
    { value: "Ciclismo", label: "Ciclismo" },
    { value: "Moda", label: "Moda" },
    { value: "Atleta", label: "Atleta" },
    { value: "Politica", label: "Politica" },
    { value: "Matematicas", label: "Matematicas" },
    { value: "Fisica", label: "Fisica" },
    { value: "Cerveza artesanal", label: "Cerveza artesanal" },
    { value: "Ver series", label: "Ver series" },
    { value: "Dormir", label: "Dormir" },
    { value: "Voleibol", label: "Voleibol" },
    { value: "Fracasar", label: "Fracasar" },
    { value: "Valer v***a", label: "Valer v***a" },
    { value: "Chismear", label: "Chismear" },
    {
      value: "Jugar Dominio y tomar anicito",
      label: "Jugar Dominio y tomar anicito",
    },
    {
      value: "Sacar los pasos prohibidos",
      label: "Sacar los pasos prohibidos",
    },
    { value: "Clavar es mi pasion", label: "Clavar es mi pasion" },
    { value: "Hacer porritos", label: "Hacer porritos" },
    { value: "Hablar como Dominicano", label: "Hablar como Dominicano" },
    { value: "Hablar con otros acentos", label: "Hablar con otros acentos" },
    { value: "Otro", label: "Otro" },
  ];

  const saveHobbies = () => {
    const dataJSON = {
      newHobbies: hobbies,
    };

    fetch("http://localhost:3001/api/hobbies", {
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
          alert("hobbies guardadas con exito");
          saved_hobbies = hobbies;
          return response.text();
        } else {
          response.text().then((text) => {
            alert(Error(text));
          });

          alert(
            response.text().then((text) => {
              throw new Error(text);
            })
          );
        }
      })
      .catch((error) => {
        alert("Error 500 al guardar los hobbies: ", error);
      });
  };

  return (
    <div className="">
      <p>Hobbies: </p>
      <MultiSelect
        options={HobbiesOptions}
        name="hobbies"
        fun={setHobbies}
        saved={saved_hobbies}
      />
      <button
        onClick={saveHobbies}
        className="my-2 bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
