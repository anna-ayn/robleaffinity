import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function editDescription(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { descripcion } = req.body;

    console.log(userId.id_cuenta, descripcion);

    const query =
      "SELECT update_info_perfil(p_id_cuenta := $1, p_descripcion := $2)";
    await client.query(query, [userId.id_cuenta, descripcion]);

    console.log("Description updated");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
