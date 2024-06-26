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
    sexo,
    idioma,
    notificaciones,
    tema,
    longitud,
    latitud,
    foto,
  } = req.body;

  try {
    const checkQuery = "SELECT * FROM cuenta WHERE email = $1";
    const checkResult = await client.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        message: "El correo electrónico ya está registrado",
      });
    }

    const checkQuery2 = "SELECT * FROM cuenta WHERE telefono = $1";
    const checkResult2 = await client.query(checkQuery2, [telefono]);

    if (checkResult2.rows.length > 0) {
      return res.status(400).json({
        message: "El número de teléfono ya está registrado",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(contrasena, salt);

    const query1 =
      "INSERT INTO cuenta(nombre, apellido, fecha_nacimiento, telefono, email, contrasena, idioma, notificaciones, tema) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)";
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
    ];

    await client.query(query1, values);

    const query2 = "SELECT id_cuenta FROM cuenta WHERE email = $1";
    const id_cuenta = await client.query(query2, [email]);

    const query3 =
      "INSERT INTO perfil(id_cuenta, sexo, longitud, latitud) VALUES($1, $2, $3, $4)";
    const values2 = [id_cuenta.rows[0].id_cuenta, sexo, longitud, latitud];

    await client.query(query3, values2);

    const query4 = "INSERT INTO tiene_foto(id_cuenta, foto) VALUES($1, $2)";
    const values3 = [id_cuenta.rows[0].id_cuenta, foto];

    await client.query(query4, values3);

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

    const query = "SELECT * FROM cuenta WHERE id_cuenta = $1";
    const data = await client.query(query, [userId.id_cuenta]);

    const query2 = "SELECT * FROM perfil WHERE id_cuenta = $1";
    const data2 = await client.query(query2, [userId.id_cuenta]);

    const query3 =
      "SELECT encode(foto, 'base64') FROM tiene_foto WHERE id_cuenta = $1";
    const fotosRows = await client.query(query3, [userId.id_cuenta]);

    console.log(fotosRows.rows);
    let fotoarray = [];
    fotosRows.rows.forEach((row) => {
      fotoarray.push(row.foto);
    });

    // solamente el nombre, apellido, fecha de nacimiento, email, telefono, idioma, notificaciones, tema
    // sexo, descripcion, latitud, longitud y fotos
    const userData = {
      nombre: data.rows[0].nombre,
      apellido: data.rows[0].apellido,
      fecha_nacimiento: data.rows[0].fecha_nacimiento,
      email: data.rows[0].email,
      telefono: data.rows[0].telefono,
      idioma: data.rows[0].idioma,
      notificaciones: data.rows[0].notificaciones,
      tema: data.rows[0].tema,
      sexo: data2.rows[0].sexo,
      descripcion: data2.rows[0].descripcion,
      latitud: data2.rows[0].latitud,
      longitud: data2.rows[0].longitud,
      fotos: fotoarray,
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
