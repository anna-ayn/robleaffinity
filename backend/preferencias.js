import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function getPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const query = "SELECT * FROM get_preferences($1)";
    const preferencias = await client.query(query, [userId.id_cuenta]);

    console.log(preferencias.rows);

    const query2 = "SELECT check_if_user_has_a_permission($1, $2)";
    const tiene_passport = await client.query(query2, [
      userId.id_cuenta,
      "passport",
    ]);

    console.log(tiene_passport.rows);

    const preferencesData = {
      grado: preferencias.rows[0].r_estudio,
      latidud_origen: preferencias.rows[0].r_latitud_origen,
      longitud_origen: preferencias.rows[0].r_longitud_origen,
      maxDistancia: preferencias.rows[0].r_distancia_max,
      minEdad: preferencias.rows[0].r_min_edad,
      maxEdad: preferencias.rows[0].r_max_edad,
      prefSexos: preferencias.rows[0].r_pref_sexos,
      prefOrientaciones: preferencias.rows[0].r_pref_orientaciones_sexuales,
      tiene_passport: tiene_passport.rows[0].check_if_user_has_a_permission,
    };

    // Envía los datos del usuario como respuesta
    res.json(preferencesData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function insertPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const {
      estudio,
      distancia_maxima,
      min_edad,
      max_edad,
      arr_prefSexos,
      arr_prefOrientaciones,
    } = req.body;

    if (estudio === "") {
      const query =
        "SELECT insert_preferences(p_id_cuenta := $1, p_distancia_maxima := $2, p_min_edad := $3, p_max_edad := $4)";
      const result = await client.query(query, [
        userId.id_cuenta,
        distancia_maxima,
        min_edad,
        max_edad,
      ]);
      res.json(result.rows);
    } else {
      const query =
        "SELECT insert_preferences(p_id_cuenta := $1, p_estudio := $2, p_distancia_maxima := $3, p_min_edad := $4, p_max_edad := $5)";
      const result = await client.query(query, [
        userId.id_cuenta,
        estudio,
        distancia_maxima,
        min_edad,
        max_edad,
      ]);
      res.json(result.rows);
    }

    for (let i = 0; i < arr_prefSexos.length; i++) {
      const query2 = "SELECT insert_pref_sexo($1, $2)";
      await client.query(query2, [userId.id_cuenta, arr_prefSexos[i]]);
    }

    for (let i = 0; i < arr_prefOrientaciones.length; i++) {
      const query3 = "SELECT insert_pref_orientacion_sexual($1, $2)";
      await client.query(query3, [userId.id_cuenta, arr_prefOrientaciones[i]]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function checkIfUserHasPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const query = "SELECT * FROM preferencias WHERE id_cuenta = $1";
    const result = await client.query(query, [userId.id_cuenta]);

    if (result.rows.length === 0) {
      res.json({ hasPreferences: false });
    } else {
      res.json({ hasPreferences: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
