import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function updateOrientaciones(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { newOrientaciones } = req.body;

    const queryOrientaciones = await client.query(
      `SELECT orientacion_sexual FROM tiene_orientacion_sexual WHERE id_cuenta = $1`,
      [userId.id_cuenta]
    );

    const oldOrientaciones = queryOrientaciones.rows.map(
      (row) => row.orientacion_sexual
    );

    console.log(oldOrientaciones, newOrientaciones);

    // chequear que Orientaciones hay que agregar
    const OrientacionesToAdd = newOrientaciones.filter(
      (orientacion) => !oldOrientaciones.includes(orientacion)
    );

    // chequear que Orientaciones hay que eliminar
    const OrientacionesToDelete = oldOrientaciones.filter(
      (orientacion) => !newOrientaciones.includes(orientacion)
    );

    console.log(OrientacionesToAdd, OrientacionesToDelete);

    // agregar Orientaciones
    for (const orientacion of OrientacionesToAdd) {
      await client.query(`Select insert_orientacion_sexual_perfil($1, $2)`, [
        userId.id_cuenta,
        orientacion,
      ]);
    }

    // eliminar Orientaciones
    for (const orientacion of OrientacionesToDelete) {
      await client.query(`Select delete_orientacion_sexual_perfil($1, $2)`, [
        userId.id_cuenta,
        orientacion,
      ]);
    }

    console.log("Orientaciones actualizados");
    res.json({ message: "Orientaciones actualizados" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
