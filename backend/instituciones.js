import { getClient } from "./client.js";
import jwt from "jsonwebtoken";


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

export async function addInstitucion(req, res){
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try{
    const { dominio, nombre, tipo, ano_fundacion, latitud, longitud } = req.body;
    const query = `
        SELECT insert_institution($1, $2, $3, $4, $5, $6);
      `;
      const values = [dominio, nombre, tipo, ano_fundacion, latitud, longitud];

      await client.query(query, values);
      res.status(200).json({ message: 'Institución agregada con éxito.' });
    }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }
}
// Agregar verificacion de admin
export async function updateInstitucion(req, res){
  const client = getClient();
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.decode(token);

  console.log(userId.id_admin);

  try{
    const { dominio, nombre, tipo, ano_fundacion } = req.body;
    const query = `
        SELECT update_institution($1, $2, $3, $4);
      `;
      const values = [dominio, nombre, tipo, ano_fundacion];

      await client.query(query, values);
      res.status(200).json({ message: 'Institución actualizada con éxito.' });
    }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await client.end();
  }

}

