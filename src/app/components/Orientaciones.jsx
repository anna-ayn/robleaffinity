import "../App.css";
import { useState } from "react";
import MultiSelect from "../components/MultiSelect";
import PropTypes from "prop-types";

export default function Orientations({ saved_orientations }) {
  Orientations.propTypes = {
    saved_orientations: PropTypes.array.isRequired,
  };

  const [Orientaciones, setOrientaciones] = useState([]);
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

  const saveOrientaciones = () => {
    const dataJSON = {
      newOrientaciones: Orientaciones,
    };

    fetch("http://localhost:3001/api/Orientaciones", {
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
          alert("Orientaciones guardadas con exito");
          saved_orientations = Orientaciones;
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
        alert("Error 500 al guardar las orientaciones: ", error);
      });
  };

  return (
    <div className="">
      <p>Orientaciones: </p>
      <MultiSelect
        options={orientationOptions}
        name="Orientaciones"
        fun={setOrientaciones}
        saved={saved_orientations}
      />
      <button
        onClick={saveOrientaciones}
        className="my-2 bg-[#13206a] hover:bg-[#3a60ac] text-white font-bold ml-2 px-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
