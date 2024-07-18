import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function addTrabajaEn(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { empresa, puesto, fecha_inicio, url } = req.body;

    const query = `SELECT insert_trabaja_en ($1, $2, $3, $4, $5)`;
    const values = [userId.id_cuenta, empresa, url, puesto, fecha_inicio];

    await client.query(query, values);

    console.log("Empresas actualizados");
    res.json({ message: "Empresas actualizados" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deleteTrabajaEn(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { id_empresa } = req.body;

    console.log(id_empresa);

    const query = `SELECT delete_trabaja_en ($1, $2)`;
    const values = [userId.id_cuenta, id_empresa];

    await client.query(query, values);

    console.log("Trabaja en eliminado");
    res.json({ message: "Trabaja en eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
