import { getClient } from "./client.js";
import jwt from "jsonwebtoken";

export async function getUsersByPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const dataDecoded = jwt.decode(token);
    const userId = dataDecoded.id_cuenta;

    const preferenceQuery = `
      SELECT pref_id_cuentas AS account_id
      FROM get_users_by_preferences_free_user($1)
    `;

    const preferenceValues = [userId];
    const preferenceResult = await client.query(
      preferenceQuery,
      preferenceValues
    );
    const userIds = preferenceResult.rows.map((row) => row.account_id);

    console.log(userIds);

    res.json(userIds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function likeOrSwipe(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const dataDecoded = jwt.decode(token);
    const userId = dataDecoded.id_cuenta;
    const { targetUserId, action } = req.body;

    if (action === "dislike") {
      await client.query("SELECT insert_swipe($1, $2)", [userId, targetUserId]);
    } else if (action === "like") {
      await client.query("SELECT insert_like($1, $2)", [userId, targetUserId]);
    } else if (action === "superlike") {
      await client.query("SELECT insert_like($1, $2, TRUE)", [
        userId,
        targetUserId,
      ]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
