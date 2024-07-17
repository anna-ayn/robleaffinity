import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function updateHobbies(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { newHobbies } = req.body;

    const queryHobbies = await client.query(
      `SELECT hobby FROM tiene_hobby WHERE id_cuenta = $1`,
      [userId.id_cuenta]
    );

    const oldHobbies = queryHobbies.rows.map((row) => row.hobby);

    console.log(oldHobbies, newHobbies);

    // chequear que hobbies hay que agregar
    const hobbiesToAdd = newHobbies.filter(
      (hobby) => !oldHobbies.includes(hobby)
    );

    // chequear que hobbies hay que eliminar
    const hobbiesToDelete = oldHobbies.filter(
      (hobby) => !newHobbies.includes(hobby)
    );

    console.log(hobbiesToAdd, hobbiesToDelete);

    // agregar hobbies
    for (const hobby of hobbiesToAdd) {
      await client.query(`Select insert_hobbies  ($1, $2)`, [
        userId.id_cuenta,
        hobby,
      ]);
    }

    // eliminar hobbies
    for (const hobby of hobbiesToDelete) {
      await client.query(`Select delete_hobby  ($1, $2)`, [
        userId.id_cuenta,
        hobby,
      ]);
    }

    console.log("Hobbies actualizados");
    res.json({ message: "Hobbies actualizados" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
