import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getClient } from "./client.js";
import bcrypt from "bcrypt";

const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

const saltRounds = 10;

app.post("/api/cuentas", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
