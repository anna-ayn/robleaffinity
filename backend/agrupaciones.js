import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function addAgrupacion(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { dominio, agrupacion } = req.body;

    const query = `SELECT insert_or_delete_agrupation ($1, $2, $3, $4)`;
    const values = [userId.id_cuenta, dominio, agrupacion, "False"];

    await client.query(query, values);

    console.log("Agrupaciones actualizadas");
    res.json({ message: "Agrupaciones actualizadas" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deleteAgrupacion(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { dominio, agrupacion } = req.body;

    const query = `SELECT insert_or_delete_agrupation ($1, $2, $3, $4)`;
    const values = [userId.id_cuenta, dominio, agrupacion, "True"];

    await client.query(query, values);

    console.log("Agrupacion eliminada");
    res.json({ message: "Agrupacion eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
