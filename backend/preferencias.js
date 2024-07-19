import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

async function checkIfUserHasPreferences(client, userId) {
  const query = "SELECT * FROM preferencias WHERE id_cuenta = $1";
  const result = await client.query(query, [userId]);

  if (result.rows.length === 0) {
    return false;
  } else {
    return true;
  }
}

export async function getPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const hasPreferences = await checkIfUserHasPreferences(
      client,
      userId.id_cuenta
    );

    const queryPassport = "SELECT check_if_user_has_a_permission($1, $2)";
    const tiene_passport = await client.query(queryPassport, [
      userId.id_cuenta,
      "passport",
    ]);

    if (!hasPreferences) {
      const latitud_longitud_userQuery =
        "SELECT latitud, longitud FROM perfil WHERE id_cuenta = $1";

      const latitud_longitud_user = await client.query(
        latitud_longitud_userQuery,
        [userId.id_cuenta]
      );

      const preferencesData = {
        grado: "",
        latidud_origen: latitud_longitud_user.rows[0].latitud,
        longitud_origen: latitud_longitud_user.rows[0].longitud,
        maxDistancia: 5,
        minEdad: 30,
        maxEdad: 99,
        prefSexos: [],
        prefOrientaciones: [],
        tiene_passport:
          tiene_passport?.rows[0]?.check_if_user_has_a_permission ?? false,
      };
      res.json(preferencesData);
      return;
    }

    const query = "SELECT * FROM get_preferences($1)";
    const preferencias = await client.query(query, [userId.id_cuenta]);

    const preferencesData = {
      grado: preferencias?.rows[0]?.r_estudio ?? null,
      latidud_origen: preferencias?.rows[0]?.r_latitud_origen ?? null,
      longitud_origen: preferencias?.rows[0]?.r_longitud_origen ?? null,
      maxDistancia: preferencias?.rows[0]?.r_distancia_max ?? null,
      minEdad: preferencias?.rows[0]?.r_min_edad ?? null,
      maxEdad: preferencias?.rows[0]?.r_max_edad ?? null,
      prefSexos: preferencias?.rows[0]?.r_pref_sexos
        ? preferencias.rows[0].r_pref_sexos.replace(/[{}]/g, "").split(",")
        : [""],
      prefOrientaciones: preferencias?.rows[0]?.r_pref_orientaciones_sexuales
        ? preferencias.rows[0].r_pref_orientaciones_sexuales
            .replace(/[{}]/g, "")
            .split(",")
        : [""],
      tiene_passport:
        tiene_passport?.rows[0]?.check_if_user_has_a_permission ?? false,
    };

    console.log("preferencias obtenidas ", preferencesData);

    preferencesData.prefSexos = preferencesData.prefSexos.map((prefSexo) =>
      prefSexo.replace(/"/g, "")
    );

    preferencesData.prefOrientaciones = preferencesData.prefOrientaciones.map(
      (prefOrientacion) => prefOrientacion.replace(/"/g, "")
    );

    res.json(preferencesData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

async function insertPreferences(
  userId,
  estudio,
  distancia_maxima,
  min_edad,
  max_edad,
  arr_prefSexos,
  arr_prefOrientaciones,
  latitud_origen,
  longitud_origen
) {
  const client = getClient();

  const queryPassport = "SELECT check_if_user_has_a_permission($1, $2)";
  const tiene_passport = await client.query(queryPassport, [
    userId,
    "passport",
  ]);

  if (tiene_passport.rows[0].check_if_user_has_a_permission === true) {
    if (latitud_origen !== 0 || longitud_origen !== 0) {
      const query =
        "SELECT insert_preferences(p_id_cuenta := $1, p_estudio := $2, p_latitud_origen := $3, p_longitud_origen := $4, p_distancia_maxima := $5, p_min_edad := $6, p_max_edad := $7)";
      await client.query(query, [
        userId,
        estudio,
        latitud_origen,
        longitud_origen,
        distancia_maxima,
        min_edad,
        max_edad,
      ]);
    }
  }

  if (estudio === "") {
    const query =
      "SELECT insert_preferences(p_id_cuenta := $1, p_distancia_maxima := $2, p_min_edad := $3, p_max_edad := $4)";
    await client.query(query, [userId, distancia_maxima, min_edad, max_edad]);
  } else {
    const query =
      "SELECT insert_preferences(p_id_cuenta := $1, p_estudio := $2, p_distancia_maxima := $3, p_min_edad := $4, p_max_edad := $5)";
    await client.query(query, [
      userId,
      estudio,
      distancia_maxima,
      min_edad,
      max_edad,
    ]);
  }

  for (let i = 0; i < arr_prefSexos.length; i++) {
    const query2 = "SELECT insert_pref_sexo($1, $2)";
    await client.query(query2, [userId, arr_prefSexos[i]]);
  }

  for (let i = 0; i < arr_prefOrientaciones.length; i++) {
    const query3 = "SELECT insert_pref_orientacion_sexual($1, $2)";
    await client.query(query3, [userId, arr_prefOrientaciones[i]]);
  }

  console.log("Preferencias insertadas exitosamente");
}

export async function updatePreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    let {
      estudio,
      distancia_maxima,
      min_edad,
      max_edad,
      arr_prefSexos,
      arr_prefOrientaciones,
      latitud_origen,
      longitud_origen,
    } = req.body;

    // ver si el usuario tiene insertada una preferencia
    const haspreferences = await checkIfUserHasPreferences(
      client,
      userId.id_cuenta
    );

    console.log("tiene preferencias ", haspreferences);
    console.log(req.body);

    if (arr_prefSexos.length === 1 && arr_prefSexos[0] === "") {
      arr_prefSexos = [];
    }

    if (arr_prefOrientaciones.length === 1 && arr_prefOrientaciones[0] === "") {
      arr_prefOrientaciones = [];
    }

    if (!haspreferences) {
      await insertPreferences(
        userId.id_cuenta,
        estudio,
        distancia_maxima,
        min_edad,
        max_edad,
        arr_prefSexos,
        arr_prefOrientaciones,
        latitud_origen,
        longitud_origen
      );
      res
        .status(200)
        .json({ message: "Preferencias actualizadas exitosamente" });
      return;
    }

    if (estudio === "") {
      estudio = null;
    }

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
    res.status(200).json({
      message: "Preferencias actualizadas exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
