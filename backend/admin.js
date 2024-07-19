import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function goToAdmin(req, res) {
  const client = getClient();
  dotenv.config();

  const { email, contrasena_propuesta } = req.body;

  try {
    const query = "SELECT * FROM admin WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Correo electrónico no registrado" });
    }

    const id_admin = result.rows[0].id_admin;

    const checkPasswordQuery =
      "SELECT (contrasena = crypt($1, contrasena)) AS password_match FROM admin WHERE id_admin = $2";

    const checkPasswordValues = [contrasena_propuesta, id_admin];
    const checkPasswordResult = await client.query(
      checkPasswordQuery,
      checkPasswordValues
    );

    if (!checkPasswordResult.rows[0].password_match) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    console.log("Passwords match! User authenticated.");
    const token = jwt.sign(
      { id_admin },
      process.env.JWT_SECRET || "defaultSecret",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
