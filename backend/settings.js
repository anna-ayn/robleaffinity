import { getClient } from "./client.js";
import { ExpressAuth } from "@auth/express";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ providers: [] }));

export async function getInfoCuenta(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    console.log(userId.id_cuenta);

    const querySettings = await client.query(
      `SELECT * FROM get_settings_app_user($1)`,
      [userId.id_cuenta]
    );

    const queryInfoCuenta = await client.query(
      `SELECT email, telefono FROM cuenta WHERE id_cuenta = $1`,
      [userId.id_cuenta]
    );

    const infoCuenta = {
      theme: querySettings.rows[0].r_tema,
      language: querySettings.rows[0].r_idioma,
      notifications: querySettings.rows[0].r_notificaciones,
      email: queryInfoCuenta.rows[0].email,
      telefono: queryInfoCuenta.rows[0].telefono,
    };

    console.log(infoCuenta);

    console.log("Configuraciones obtenidos exitosamente");
    res.status(200).json(infoCuenta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function updateInfoCuenta(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { email, telefono, oldpassword, newpassword } = req.body;
    console.log(req.body);

    const queryEmailPassword = `SELECT * FROM get_email_and_hashpassword_user($1)`;
    const valuesEmailPassword = [userId.id_cuenta];

    const data = await client.query(queryEmailPassword, valuesEmailPassword);

    bcrypt.compare(
      oldpassword,
      data.rows[0].r_contrasena,
      async (err, resCompare) => {
        if (err) {
          // Handle error
          console.error("Error comparing passwords:", err);
          await client.end();
          return res.status(500).json({ message: err.message });
        }

        if (resCompare) {
          // Passwords match, authentication successful
          console.log("Passwords match! User authenticated.");

          // update info account
          if (!newpassword) {
            const queryUpdateInfoAccount = `SELECT update_info_account(c_id_cuenta := $1, c_email := $2, c_telefono := $3)`;
            const valuesUpdateInfoAccount = [userId.id_cuenta, email, telefono];
            await client.query(queryUpdateInfoAccount, valuesUpdateInfoAccount);
            console.log("Correo y telefono actualizados exitosamente");
          } else {
            // change new password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(newpassword, salt);
            const queryUpdateInfoAccount = `SELECT update_info_account(c_id_cuenta := $1, c_email := $2, c_telefono := $3, c_contrasena := $4)`;
            const valuesUpdateInfoAccount = [
              userId.id_cuenta,
              email,
              telefono,
              hash,
            ];
            await client.query(queryUpdateInfoAccount, valuesUpdateInfoAccount);
            console.log(
              "Correo, telefono y contrasena actualizados exitosamente"
            );
          }
          res.json({ message: "Cuenta actualizada" });
          await client.end();
        } else {
          // Passwords don't match, authentication failed
          console.log("Passwords do not match! Authentication failed.");
          await client.end();
          res.status(400).json({ message: "Contraseña actual incorrecta" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    await client.end();
    res.status(500).json({ message: error.message });
  }
}

export async function updateSettings(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.decode(token);

    const { idioma, tema, notificaciones } = req.body;

    const queryInfoCuenta = `SELECT update_info_account(c_id_cuenta := $1, c_idioma := $2, c_tema := $3, c_notificaciones := $4)`;
    const valuesInfoCuenta = [userId.id_cuenta, idioma, tema, notificaciones];
    await client.query(queryInfoCuenta, valuesInfoCuenta);

    console.log("Configuraciones actualizadas exitosamente");
    res.status(200).json({ message: "Configuraciones actualizadas" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
