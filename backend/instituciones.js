import { getClient } from "./client.js";

export async function getInstituciones(req, res) {
  const client = getClient();

  try {
    const query =
      "SELECT r_dominio AS dominio, r_nombre AS nombre FROM get_all_Institutions()";
    const data = await client.query(query);

    // Envía los datos de las instituciones como respuesta
    res.json(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
