import { getClient } from "./client.js";
import bcrypt from "bcrypt";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

const saltRounds = 10;

export async function createAccount(req, res) {
  const client = getClient();
  const {
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    email,
    contrasena,
    idioma,
    notificaciones,
    tema,
    sexo,
    longitud,
    latitud,
    descripcion,
    fotos,
    dominio_institucion,
    grado,
    especialidad,
    anio_inicio,
    anio_fin,
  } = req.body;

  console.log(req.body);

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(contrasena, salt);

    const query =
      "SELECT create_new_user($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::TEXT[], $15, $16, $17, $18, $19)";
    const values = [
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email,
      hash,
      idioma,
      notificaciones,
      tema,
      sexo,
      latitud,
      longitud,
      descripcion,
      fotos,
      dominio_institucion,
      grado,
      especialidad,
      anio_inicio,
      anio_fin,
    ];

    await client.query(query, values);
    console.log("Cuenta creada exitosamente! ya puedes iniciar sesion");
    return res
      .status(201)
      .json({ success: true, message: "Cuenta insertada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function login(req, res) {
  const client = getClient();
  dotenv.config();

  const { email, contrasena } = req.body;

  try {
    const query = "SELECT * FROM cuenta WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Correo electrónico no registrado" });
    }

    console.log(result.rows[0]);

    const id_cuenta = result.rows[0].id_cuenta;

    const hash = result.rows[0]?.contrasena;

    bcrypt.compare(contrasena, hash, (err, resCompare) => {
      if (err) {
        // Handle error
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: err.message });
      }

      if (resCompare) {
        // Passwords match, authentication successful
        console.log("Passwords match! User authenticated.");
        const token = jwt.sign(
          { id_cuenta },
          process.env.JWT_SECRET || "defaultSecret",
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ success: true, token });
      } else {
        // Passwords don't match, authentication failed
        console.log("Passwords do not match! Authentication failed.");
        res.status(401).json({ message: "Contraseña incorrecta" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function getData(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const query = "SELECT * FROM get_all_public_info_about_user($1)";
    const data = await client.query(query, [userId.id_cuenta]);

    const dominio_instituciones = data.rows[0].r_instituciones;
    const id_empresas = data.rows[0].r_empresas;

    let estudio_en_instituciones = [];
    let agrupaciones = [];
    for (const dominio of dominio_instituciones) {
      const query2 = "SELECT * FROM get_user_estudio_en($1, $2)";
      const data2 = await client.query(query2, [userId.id_cuenta, dominio]);

      estudio_en_instituciones.push(data2.rows);

      const query3 =
        "SELECT * FROM get_user_agrupaciones_in_a_institution($1, $2)";
      const data3 = await client.query(query3, [userId.id_cuenta, dominio]);

      agrupaciones.push(data3.rows);
    }

    let trabaja_en_empresas = [];
    for (const id_empresa of id_empresas) {
      const query4 =
        "SELECT * FROM get_all_info_about_a_user_trabaja_en($1, $2)";
      const data4 = await client.query(query4, [userId.id_cuenta, id_empresa]);

      trabaja_en_empresas.push(data4.rows);
    }

    const url =
      "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      data.rows[0].r_latitud +
      "&lon=" +
      data.rows[0].r_longitud;

    // fetch api
    const response = await fetch(url);
    const address = await response.json();

    const userData = {
      nombre: data.rows[0].r_nombre,
      apellido: data.rows[0].r_apellido,
      edad: data.rows[0].r_edad,
      sexo: data.rows[0].r_sexo,
      descripcion: data.rows[0].r_descripcion,
      verificado: data.rows[0].r_verificado,
      ciudad: address.address.city,
      pais: address.address.country,
      hobbies: data.rows[0].r_hobbies,
      certificaciones: data.rows[0].r_certificaciones,
      habilidades: data.rows[0].r_habilidades,
      orientaciones: data.rows[0].r_orientacion_sexual,
      fotos: data.rows[0].r_fotos,
      lista_trabajos: trabaja_en_empresas,
      lista_estudios: estudio_en_instituciones,
      lista_agrupaciones: agrupaciones,
    };

    console.log(userData);

    // Envía los datos del usuario como respuesta
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
