import { getClient } from "./client.js";
import jwt from "jsonwebtoken";

export async function getUsersByPreferences(req, res) {
  const client = getClient();

  try {
    const token = req.headers.authorization.split(" ")[1];
    const dataDecoded = jwt.decode(token);
    const userId = dataDecoded.id_cuenta;

    // chequear si el usuario tiene preferencias
    const queryHasPreferences = `SELECT * from preferencias WHERE id_cuenta = $1`;
    const valuesHasPreferences = [userId];
    const resultHasPreferences = await client.query(
      queryHasPreferences,
      valuesHasPreferences
    );

    let preferenceQuery;
    if (resultHasPreferences.rows.length === 0) {
      preferenceQuery = `
      SELECT id_cuenta_at_max_distance AS account_id 
      FROM get_all_users_by_max_distance($1)`;
    } else {
      // chequear si el usuario tiene el permiso passport
      const checkpassportquery = `SELECT check_if_user_has_a_permission($1, 'passport')`;
      const checkpassportValues = [userId];
      const checkpassportResult = await client.query(
        checkpassportquery,
        checkpassportValues
      );

      if (
        checkpassportResult.rows[0].check_if_user_has_a_permission === false
      ) {
        preferenceQuery = `
        SELECT pref_id_cuentas AS account_id
        FROM get_users_by_preferences_free_user($1)
      `;
      } else {
        preferenceQuery = `
        SELECT pref_id_cuentas AS account_id
        FROM get_users_by_preferences_passport_user($1)
      `;
      }
    }

    const preferenceValues = [userId];
    const preferenceResult = await client.query(
      preferenceQuery,
      preferenceValues
    );
    const userIds = preferenceResult.rows.map((row) => row.account_id);

    console.log(userIds);

    // chequear si alguno de estos usuarios dieron superlike a este usuario
    const superlikeQuery = `
      SELECT id_liker
      FROM likes
      WHERE id_liked = $1 AND super = TRUE
    `;

    const superlikeValues = [userId];
    const superlikeResult = await client.query(superlikeQuery, superlikeValues);

    let superlikeUserIds = [];

    for (let i = 0; i < superlikeResult.rows.length; i++) {
      if (userIds.includes(superlikeResult.rows[i].id_liker))
        superlikeUserIds.push(superlikeResult.rows[i].id_liker);
    }

    const data = {
      userIds: userIds,
      superUsers: superlikeUserIds,
    };

    console.log(data);

    res.json(data);
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

    console.log(userId, targetUserId, action);

    // verificar si hay un like
    const likesQuery = `
      SELECT * from likes WHERE id_liker = $1 AND id_liked = $2
    `;
    const likesValues = [userId, targetUserId];

    const likesResult = await client.query(likesQuery, likesValues);
    if (likesResult.rows.length > 0) {
      res.status(403).json({ message: "Ya le has dado un like" });
      return;
    }

    // verificar si hay un dislike
    const dislikesQuery = `
      SELECT * from swipes WHERE id_disliker = $1 AND id_disliked = $2
    `;
    const dislikesValues = [userId, targetUserId];

    const dislikesResult = await client.query(dislikesQuery, dislikesValues);
    if (dislikesResult.rows.length > 0) {
      res.status(403).json({ message: "Ya le has dado un dislike" });
      return;
    }

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

    res.status(200).json({ message: "Like dado con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
