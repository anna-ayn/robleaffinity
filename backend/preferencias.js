import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

const maxRetries = 5;

async function queryWithRetry(query, values, retries = 0) {
  const client = getClient();
  
  try {
    const result = await client.query(query, values);
    return result;
  } catch (err) {
    if (err.code === 'XX000' && retries < maxRetries) {
      console.log(`Retrying query, attempt ${retries + 1}`);
      await new Promise(res => setTimeout(res, (retries + 1) * 100)); // Exponential backoff
      return queryWithRetry(query, values, retries + 1);
    } else {
      throw err;
    }
  }
}

export async function getPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const query = "SELECT * FROM get_preferences($1)";
    const preferencias = await client.query(query, [userId.id_cuenta]);

    const query2 = "SELECT check_if_user_has_a_permission($1, $2)";
    const tiene_passport = await client.query(query2, [
      userId.id_cuenta,
      "passport",
    ]);

    const preferencesData = {
      grado: preferencias?.rows[0]?.r_estudio ?? null,
      latidud_origen: preferencias?.rows[0]?.r_latitud_origen ?? null,
      longitud_origen: preferencias?.rows[0]?.r_longitud_origen ?? null,
      maxDistancia: preferencias?.rows[0]?.r_distancia_max ?? null,
      minEdad: preferencias?.rows[0]?.r_min_edad ?? null,
      maxEdad: preferencias?.rows[0]?.r_max_edad ?? null,
      prefSexos: preferencias?.rows[0]?.r_pref_sexos 
        ? preferencias.rows[0].r_pref_sexos.replace(/[{}]/g, "").split(",") 
        : [],
      prefOrientaciones: preferencias?.rows[0]?.r_pref_orientaciones_sexuales 
        ? preferencias.rows[0].r_pref_orientaciones_sexuales.replace(/[{}]/g, "").split(",") 
        : [],
      tiene_passport: tiene_passport?.rows[0]?.check_if_user_has_a_permission ?? false,
    };
    

    console.log(preferencesData)

    preferencesData.prefSexos = preferencesData.prefSexos.map((prefSexo) =>
      prefSexo.replace(/"/g, "")
    );
    preferencesData.prefOrientaciones = preferencesData.prefOrientaciones.map(
      (prefOrientacion) => prefOrientacion.replace(/"/g, "")
    );

    console.log(preferencesData);

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
      await client.query(query, [
        userId.id_cuenta,
        distancia_maxima,
        min_edad,
        max_edad,
      ]);
    } else {
      const query =
        "SELECT insert_preferences(p_id_cuenta := $1, p_estudio := $2, p_distancia_maxima := $3, p_min_edad := $4, p_max_edad := $5)";
      await client.query(query, [
        userId.id_cuenta,
        estudio,
        distancia_maxima,
        min_edad,
        max_edad,
      ]);
    }

    for (let i = 0; i < arr_prefSexos.length; i++) {
      const query2 = "SELECT insert_pref_sexo($1, $2)";
      await client.query(query2, [userId.id_cuenta, arr_prefSexos[i]]);
    }

    for (let i = 0; i < arr_prefOrientaciones.length; i++) {
      const query3 = "SELECT insert_pref_orientacion_sexual($1, $2)";
      await client.query(query3, [userId.id_cuenta, arr_prefOrientaciones[i]]);
    }

    console.log("Preferencias insertadas exitosamente");

    res.status(201).json({ message: "Preferencias insertadas exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function checkIfUserHasPreferences(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Reemplaza 'your_secret_key' con tu clave secreta real
    const userId = decoded.id_cuenta;

    const query = "SELECT * FROM preferencias WHERE id_cuenta = $1";
    const result = await queryWithRetry(query, [userId]);

    if (result.rows.length === 0) {
      return res.json({ hasPreferences: false });
    } else {
      return res.json({ hasPreferences: true });
    }
  } catch (error) {
    console.log('Error checking user preferences:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(500).json({ message: error.message });
  }
}
export async function updatePreferences(req, res) {
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
      latitud_origen,
      longitud_origen,
    } = req.body;

    console.log(
      estudio,
      distancia_maxima,
      min_edad,
      max_edad,
      arr_prefSexos,
      arr_prefOrientaciones,
      latitud_origen,
      longitud_origen,
    )

    if (latitud_origen && longitud_origen) {
      const query_passport = "SELECT check_if_user_has_a_permission($1, $2)";
      const tiene_passport = await client.query(query_passport, [
        userId.id_cuenta,
        "passport",
      ]);
      if (tiene_passport) {
        const query = "SELECT update_preferences($1, $2, $3, $4, $5, $6, $7)";
        await client.query(query, [
          userId.id_cuenta,
          estudio,
          latitud_origen,
          longitud_origen,
          distancia_maxima,
          min_edad,
          max_edad,
        ]);
        console.log("Ubicación de preferencias actualizada exitosamente");
      } else {
        console.log(
          "El usuario no tiene el permiso para modificar la ubicación de preferencias"
        );
        res.status(401).json({
          message:
            "El usuario no tiene el permiso para modificar la ubicación de preferencias",
        });
      }
    } else {
      const query =
        "SELECT update_preferences(p_id_cuenta := $1, p_estudio := $2, p_distancia_maxima := $3, p_min_edad := $4, p_max_edad := $5)";
      await client.query(query, [
        userId.id_cuenta,
        estudio,
        distancia_maxima,
        min_edad,
        max_edad,
      ]);
    }

    console.log("update de preferencias de sexo...");
    // buscar preferencias de sexo actuales
    const queryPrefSexos = await client.query(
      `SELECT sexo FROM pref_sexo WHERE id_cuenta = $1`,
      [userId.id_cuenta]
    );

    const oldPrefSexos = queryPrefSexos.rows.map((row) => row.sexo);

    // chequear que pref sexos hay que agregar
    const PrefSexosToAdd = arr_prefSexos.filter(
      (prefsex) => !oldPrefSexos.includes(prefsex)
    );

    // chequear que PrefSexos hay que eliminar
    const PrefSexosToDelete = oldPrefSexos.filter(
      (prefsex) => !arr_prefSexos.includes(prefsex)
    );

    // agregar PrefSexos
    for (const prefsex of PrefSexosToAdd) {
      await client.query(`Select insert_pref_sexo ($1, $2)`, [
        userId.id_cuenta,
        prefsex,
      ]);
    }

    // eliminar PrefSexos
    for (const prefsex of PrefSexosToDelete) {
      await client.query(`Select delete_pref_sexo ($1, $2)`, [
        userId.id_cuenta,
        prefsex,
      ]);
    }

    console.log("update de preferencias de orientación sexual...");
    // buscar preferencias de orientación sexual actuales
    const queryPrefOrientaciones = await client.query(
      `SELECT orientacion_sexual FROM pref_orientacion_sexual WHERE id_cuenta = $1`,
      [userId.id_cuenta]
    );

    const oldPrefOrientaciones = queryPrefOrientaciones.rows.map(
      (row) => row.orientacion_sexual
    );

    // chequear que pref orientaciones hay que agregar
    const PrefOrientacionesToAdd = arr_prefOrientaciones.filter(
      (preforient) => !oldPrefOrientaciones.includes(preforient)
    );

    // chequear que PrefOrientaciones hay que eliminar
    const PrefOrientacionesToDelete = oldPrefOrientaciones.filter(
      (preforient) => !arr_prefOrientaciones.includes(preforient)
    );

    // agregar PrefOrientaciones
    for (const preforient of PrefOrientacionesToAdd) {
      await client.query(`Select insert_pref_orientacion_sexual ($1, $2)`, [
        userId.id_cuenta,
        preforient,
      ]);
    }

    // eliminar PrefOrientaciones
    for (const preforient of PrefOrientacionesToDelete) {
      await client.query(`Select delete_pref_orientacion_sexual ($1, $2)`, [
        userId.id_cuenta,
        preforient,
      ]);
    }

    console.log("Preferencias actualizadas exitosamente");
    res.json({
      message: "Preferencias actualizadas exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
