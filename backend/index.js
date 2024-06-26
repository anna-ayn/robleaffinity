import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createAccount, login, getData } from "./cuenta.js";

const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

app.post("/api/cuentas", createAccount);
app.post("/api/login", login);
app.get("/api/getData", getData);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
