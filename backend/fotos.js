import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function addPhoto(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { photo } = req.body;

    const query = "SELECT insert_foto($1, $2)";
    const values = [userId.id_cuenta, photo];

    await client.query(query, values);

    console.log("Foto subido");
    res.json({ message: "Foto subido" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deletePhoto(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { r_id_foto } = req.body;

    const query = "SELECT delete_foto($1, $2)";
    const values = [userId.id_cuenta, r_id_foto];

    await client.query(query, values);

    console.log("foto eliminado");
    res.json({ message: "foto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
