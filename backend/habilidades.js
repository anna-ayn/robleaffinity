import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function updateHabilidades(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    console.log(userId.id_cuenta);

    const { newHabilidades } = req.body;

    const queryHabilidades = await client.query(
      `SELECT habilidad FROM tiene_habilidades WHERE id_cuenta = $1`,
      [userId.id_cuenta]
    );

    const oldHabilidades = queryHabilidades.rows.map((row) => row.habilidad);

    console.log(oldHabilidades, newHabilidades);

    // chequear que habilidades hay que agregar
    const habilidadesToAdd = newHabilidades.filter(
      (habilidad) => !oldHabilidades.includes(habilidad)
    );

    // chequear que habilidades hay que eliminar
    const habilidadesToDelete = oldHabilidades.filter(
      (habilidad) => !newHabilidades.includes(habilidad)
    );

    // agregar habilidades
    for (const habilidad of habilidadesToAdd) {
      console.log(habilidad);
      await client.query(`Select insert_habilidades  ($1, $2)`, [
        userId.id_cuenta,
        habilidad,
      ]);
    }

    // eliminar habilidades
    for (const habilidad of habilidadesToDelete) {
      await client.query(`Select delete_habilidad  ($1, $2)`, [
        userId.id_cuenta,
        habilidad,
      ]);
    }

    console.log("Habilidades actualizados");
    res.json({ message: "Habilidades actualizados" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
