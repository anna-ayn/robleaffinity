import jwt from "jsonwebtoken";
import { getClient } from "./client.js";

export async function addTier(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const { nombre, monto } = req.body;
    const query = "SELECT insert_new_tier($1, $2);";
    const values = [nombre, monto];

    await client.query(query, values);
    res.status(200).json({ message: "Tier agregado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function updateTier(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const { nombre, monto } = req.body;
    const query = "SELECT update_price_tier($1, $2);";
    const values = [nombre, monto];

    await client.query(query, values);
    res.status(200).json({ message: "Tier agregado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function deleteTier(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const { nombre_tier } = req.body;
    const query = "SELECT delete_tier($1);";
    const value = nombre_tier;

    await client.query(query, value);
    res.status(200).json({ message: "Tier eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function addPermission(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const { name, description } = req.body;
    const query = "SELECT insert_new_permission($1,$2);";
    const values = [name, description];

    await client.query(query, values);
    res.status(200).json({ message: "Permiso agregado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function linkTierWithPermission(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const { nameTier, namePermission } = req.body;
    const query = "SELECT link_tiers_with_permissions($1,$2);";
    const values = [nameTier, namePermission];

    await client.query(query, values);
    res.status(200).json({ message: "Permiso agregado a tier con  éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function deletePermission(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const name = req.body;
    const query = "SELECT delete_permission($1);";
    const value = name;

    await client.query(query, value);
    res.status(200).json({ message: "Permiso eliminado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}

export async function changePermissionOnTiers(req, res) {
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try {
    const { nameTier, permissionToUnlink, permissionToLink } = req.body;
    const query = "SELECT change_permission_on_tiers($1, $2, $3);";
    const values = [nameTier, permissionToUnlink, permissionToLink];

    await client.query(query, values);
    res.status(200).json({ message: "Tier ${nameTier} cambiado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
