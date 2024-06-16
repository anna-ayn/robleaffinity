const express = require('express')
const app = express()
const port = 3001

const { insertarCuenta } = require('./cuenta.js')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.post('/cuentas', (req, res) => {
  const result = insertarCuenta(req.body);
  res.send(result);
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})