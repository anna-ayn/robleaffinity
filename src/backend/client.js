
import dotenv from 'dotenv';
import pg from "pg";
dotenv.config();

export function getClient() {
  const { Pool } = pg;

  dotenv.config();

  const client = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: true,
  });

  // verificar conexion a la bd
  client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack);
    } else {
      console.log('Conectado a la bd 🙈');
    }
  });

  // setear el esquema a tinder_viejos_egresados
  client.query('ALTER DATABASE soft3bd SET search_path TO tinder_viejos_egresados');

  // setear el tipo de estilo de la fecha SET DATESTYLE TO 'European';
  client.query('SET DATESTYLE TO "European"');

  // show search_path
  client.query('SHOW search_path', (err, res) => {
    if (err) {
      console.error(err.stack);
    } else {
      console.log(res.rows);
    }
  });

  return client;
}
