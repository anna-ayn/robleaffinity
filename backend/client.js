import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

export function getClient() {
  dotenv.config();

  const client = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    connectionString: process.env.PG_CONNECTION_STRING,
  });

  // verificar conexion a la bd
  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      console.log("Conectado a la bd 🙈");
    }
  });

  // setear el esquema a tinder_viejos_egresados
  client.query(
    "ALTER DATABASE robleaffinity SET search_path TO tinder_viejos_egresados"
  );

  // setear el tipo de estilo de la fecha SET DATESTYLE TO 'European';
  client.query('SET DATESTYLE TO "European"');

  return client;
}
