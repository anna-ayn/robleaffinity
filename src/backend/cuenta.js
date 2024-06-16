
const { getClient } = require("./client.js");
const bcrypt = require('bcrypt');

const saltRounds = 10;

// funcion para insertar una cuenta en la bd

const insertarCuenta = async (body) => {
  const client = getClient();
  const {nombre, apellido, fecha_nacimiento, telefono, email, contrasena} = body;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
        console.log('error generating salt');
        return;
    }

    bcrypt.hash(contrasena, salt, (err, hash) => {
        if (err) {
            console.log('error hashing password');
            console.log(err);
            return;
        }

        let insertRow = client.query('INSERT INTO cuenta(nombre, apellido, fecha_nacimiento, telefono, email, contrasena) VALUES($1, $2, $3, $4, $5, $6);', [`${nombre}`, `${apellido}`, `${fecha_nacimiento}`, `${telefono}`, `${email}`, `${hash}`]);
        // check if the query was successful
        insertRow
            .then(() => {
                console.log('Cuenta insertada correctamente');
            })
            .catch((error) => {
                console.error('Error al insertar la cuenta', error);
                return error;
            });
    });
  });
};

module.exports = { insertarCuenta };
