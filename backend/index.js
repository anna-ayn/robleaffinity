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
  const { nombre, apellido, fecha_nacimiento, telefono, email, contrasena } =
    req.body;

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

    const query =
      "INSERT INTO cuenta(nombre, apellido, fecha_nacimiento, telefono, email, contrasena) VALUES($1, $2, $3, $4, $5, $6)";
    const values = [nombre, apellido, fecha_nacimiento, telefono, email, hash];

    await client.query(query, values);
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
