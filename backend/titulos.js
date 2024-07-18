import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function addTitulo(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { dominio, grado, especialidad, anio_ingreso, anio_egreso } =
      req.body;

    const query = `SELECT insert_new_estudio_en ($1, $2, $3, $4, $5, $6)`;
    const values = [
      userId.id_cuenta,
      dominio,
      grado,
      especialidad,
      anio_ingreso,
      anio_egreso,
    ];

    await client.query(query, values);

    console.log("Titulos actualizados");
    res.json({ message: "Titulos actualizados" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deleteTitulo(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { dominio, grado, especialidad } = req.body;

    const query = `SELECT delete_estudio_en ($1, $2, $3, $4)`;
    const values = [userId.id_cuenta, dominio, grado, especialidad];

    await client.query(query, values);

    console.log("Titulo eliminado");
    res.json({ message: "Titulo eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
