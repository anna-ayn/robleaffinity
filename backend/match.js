import { getClient } from "./client.js";
import jwt from "jsonwebtoken";

export async function getUsersByPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const dataDecoded = jwt.decode(token);
    const userId = dataDecoded.id_cuenta
    
    const query = `
      SELECT pref_id_cuentas AS account_id 
      FROM get_users_by_preferences_free_user($1)
    `;

    const values = [userId];
    const data = await client.query(query, values);

    res.json(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
