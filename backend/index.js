import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { createAccount, login, getData } from "./cuenta.js";
import { getInstituciones } from "./instituciones.js";
import { getPreferences, insertPreferences } from "./preferencias.js";
import { editDescription, verifiedUser } from "./perfil.js";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use(bodyParser.json());

const upload = multer();

app.get("/api/instituciones", getInstituciones);
app.post("/api/cuentas", upload.none(), createAccount);
app.post("/api/login", login);
app.get("/api/getData", getData);
app.get("/api/getPreferences", getPreferences);
app.post("/api/insertPreferences", insertPreferences);
app.post("/api/editDescription", editDescription);
app.post("/api/verificarUsuario", verifiedUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
