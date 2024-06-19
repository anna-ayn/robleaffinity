import { getClient } from "./client.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const insertarCuenta = async (body) => {
  const client = getClient();
  const { nombre, apellido, fecha_nacimiento, telefono, email, contrasena } =
    body;

  try {
    const checkQuery = "SELECT * FROM cuenta WHERE email = $1";
    const checkResult = await client.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      };
    }

    const checkQuery2 = "SELECT * FROM cuenta WHERE telefono = $1";
    const checkResult2 = await client.query(checkQuery2, [telefono]);

    if (checkResult2.rows.length > 0) {
      return {
        success: false,
        message: "El número de teléfono ya está registrado",
      };
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(contrasena, salt);

    const query =
      "INSERT INTO cuenta(nombre, apellido, fecha_nacimiento, telefono, email, contrasena) VALUES($1, $2, $3, $4, $5, $6)";
    const values = [nombre, apellido, fecha_nacimiento, telefono, email, hash];

    await client.query(query, values);
    return { success: true, message: "Cuenta insertada correctamente" };
  } catch (error) {
    console.log(error);
    throw error; // Lanzar el error para que sea atrapado en app.post
  } finally {
    await client.end();
  }
};
