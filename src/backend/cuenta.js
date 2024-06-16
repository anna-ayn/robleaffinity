
const { getClient } = require("./client.js");
const bcrypt = require('bcrypt');

const salt = 10;

bcrypt.genSalt(salt);

// funcion para insertar una cuenta en la bd

const insertarCuenta = async (body) => {
  const client = getClient();
  console.log("HOLAAAAA");
  const {nombre, apellido, fecha_nacimiento, telefono, email, contrasena} = body;
  bcrypt.hash(contrasena, salt, (err, hash) => {
    if (err) {
        console.log('error hashing password');
        console.log(err);
        return;
    }
    // Store hash in your password DB.
    console.log(hash);
    hashedPassword = hash;
  });
  let insertRow = client.query('INSERT INTO cuenta(nombre, apellido, fecha_nacimiento, telefono, email, contrasena) VALUES($1, $2, $3, $4, $5, $6);', [`${nombre}`, `${apellido}`, `${fecha_nacimiento}`, `${telefono}`, `${email}`, `${hashedPassword}`]);
  // check if the query was successful
  insertRow
    .then(() => {
      console.log('Cuenta insertada correctamente');
    })
    .catch((error) => {
      console.error('Error al insertar la cuenta', error);
    });
  client.end();
};

module.exports = { insertarCuenta };
