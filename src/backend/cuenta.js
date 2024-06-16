
import { MdChildFriendly } from "react-icons/md";
import { getClient } from "./client.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

// funcion para insertar una cuenta en la bd

export const insertarCuenta = async (body) => {
  console.log(body);
  const client = getClient();
  const {nombre, apellido, fecha_nacimiento, telefono, email, contrasena} = body;
  const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
  let insertRow = client.query('INSERT INTO cuenta(nombre, apellido, fecha_nacimiento, telefono, email, contrasena) VALUES($1, $2, $3, $4, $5, $6);', [`${nombre}`, `${apellido}`, `${fecha_nacimiento}`, `${telefono}`, `${email}`, `${hashedPassword}`]);
  console.log(`Inserted ${insertRow.rowCount} row`);
  client.end();
};

// funcion para obtener una cuenta en la bd con un id especifico
export const obtenerCuenta = async (req, res) => {
    const client = getClient();
    const id = req.params.id;
    const query = `SELECT * FROM cuenta WHERE id_cuenta = ${id}`;
    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error en el servidor interno' });
    }
}

// funcion para eliminar una cuenta en la bd con un id especifico
export const eliminarCuenta = async (req, res) => {
    const client = getClient();
    const id = req.params.id;
    const query = `DELETE FROM cuenta WHERE id_cuenta = ${id}`;
    try {
        const result = await client.query(query);
        res.status(200).json({ message: 'Se elimino la cuenta exitosamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error en el servidor interno' });
    }
}