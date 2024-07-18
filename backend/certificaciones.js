import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function addCertificacion(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { certificado } = req.body;

    const query = `SELECT insert_certificacion ($1, $2)`;
    const values = [userId.id_cuenta, certificado];

    await client.query(query, values);

    console.log("Certificaciones actualizadas");
    res.json({ message: "Certificaciones actualizadas" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deleteCertificacion(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { r_certificacion } = req.body;

    const query = `SELECT delete_certificacion ($1, $2)`;
    const values = [userId.id_cuenta, r_certificacion];

    await client.query(query, values);

    console.log("Certificación eliminada");
    res.json({ message: "Certificación eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
