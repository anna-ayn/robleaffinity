import "../App.css";
import { useState } from "react";
import MultiSelect from "../components/MultiSelect";
import PropTypes from "prop-types";

export default function Habilidades({ saved_habilidades }) {
  Habilidades.propTypes = {
    saved_habilidades: PropTypes.array.isRequired,
  };

  const [habilidades, setHabilidades] = useState([]);
  const HabilidadesOptions = [
    { value: "Analítica", label: "Analítica" },
    { value: "Artística", label: "Artística" },
    { value: "Atención al detalle", label: "Atención al detalle" },
    { value: "Autodisciplina", label: "Autodisciplina" },
    { value: "Capacidad de aprendizaje", label: "Capacidad de aprendizaje" },
    { value: "Enseñanza", label: "Enseñanza" },
    { value: "Capacidad de escucha", label: "Capacidad de escucha" },
    { value: "Negociación", label: "Negociación" },
    { value: "Organización", label: "Organización" },
    { value: "Persuasión", label: "Persuasión" },
    { value: "Planificación", label: "Planificación" },
    { value: "Toma de decisiones", label: "Toma de decisiones" },
    {
      value: "Capacidad para trabajar bajo presión",
      label: "Capacidad para trabajar bajo presión",
    },
    { value: "Creatividad", label: "Creatividad" },
    { value: "Empatía", label: "Empatía" },
    { value: "Energía", label: "Energía" },
    { value: "Flexibilidad", label: "Flexibilidad" },
    {
      value: "Habilidades de comunicación",
      label: "Habilidades de comunicación",
    },
    { value: "Habilidades de liderazgo", label: "Habilidades de liderazgo" },
    { value: "Habilidades de venta", label: "Habilidades de venta" },
    {
      value: "Habilidades interpersonales",
      label: "Habilidades interpersonales",
    },
    { value: "Habilidades matemáticas", label: "Habilidades matemáticas" },
    { value: "Habilidades técnicas", label: "Habilidades técnicas" },
    { value: "Iniciativa", label: "Iniciativa" },
    { value: "Inteligencia emocional", label: "Inteligencia emocional" },
    { value: "Motivación", label: "Motivación" },
    { value: "Paciencia", label: "Paciencia" },
    { value: "Perseverancia", label: "Perseverancia" },
    { value: "Resiliencia", label: "Resiliencia" },
    { value: "Visión estratégica", label: "Visión estratégica" },
    { value: "Chambeo", label: "Chambeo" },
    {
      value: "Procrastinacion productiva",
      label: "Procrastinacion productiva",
    },
    { value: "Buenisimo en Memardos", label: "Buenisimo en Memardos" },
    { value: 'Llorando pero pa" lante', label: "Llorando pero pa'' lante" },
    { value: "Canta y no llores", label: "Canta y no llores" },
    { value: "Otro", label: "Otro" },
  ];

  const saveHabilidades = () => {
    const dataJSON = {
      newHabilidades: habilidades,
    };

    fetch("http://localhost:3001/api/habilidades", {
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
          alert("habilidades guardadas con exito");
          saved_habilidades = habilidades;
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
        alert("Error 500 al guardar los habilidades: ", error);
      });
  };

  return (
    <div className="">
      <p>Habilidades: </p>
      <MultiSelect
        options={HabilidadesOptions}
        name="habilidades"
        fun={setHabilidades}
        saved={saved_habilidades}
      />
      <button
        onClick={saveHabilidades}
        className="my-2 bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
