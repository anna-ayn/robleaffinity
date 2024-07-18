import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { createAccount, login, getData, getAnotherUserData } from "./cuenta.js";
import { getInstituciones } from "./instituciones.js";
import {
  getPreferences,
  insertPreferences,
  checkIfUserHasPreferences,
  updatePreferences,
} from "./preferencias.js";
import { editDescription, verifiedUser } from "./perfil.js";
import { updateHobbies } from "./hobbies.js";
import { updateHabilidades } from "./habilidades.js";
import { addPhoto, deletePhoto } from "./fotos.js";
import { updateOrientaciones } from "./orientaciones.js";
import { addCertificacion, deleteCertificacion } from "./certificaciones.js";
import { addAgrupacion, deleteAgrupacion } from "./agrupaciones.js";
import { addTitulo, deleteTitulo } from "./titulos.js";
import { addTrabajaEn, deleteTrabajaEn } from "./trabaja_en.js";
import { getInfoCuenta, updateInfoCuenta, updateSettings } from "./settings.js";

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

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    fieldSize: 5 * 1024 * 1024, // 5 MB
  },
});

app.get("/api/instituciones", getInstituciones);
app.post("/api/cuentas", upload.none(), createAccount);
app.post("/api/login", login);
app.get("/api/getData", getData);
app.get("/api/getPreferences", getPreferences);
app.post("/api/insertPreferences", insertPreferences);
app.post("/api/editDescription", editDescription);
app.post("/api/verificarUsuario", verifiedUser);
app.post("/api/hobbies", updateHobbies);
app.post("/api/habilidades", updateHabilidades);
app.post("/api/addPhoto", upload.none(), addPhoto);
app.post("/api/deletePhoto", deletePhoto);
app.post("/api/Orientaciones", updateOrientaciones);
app.post("/api/addCertificacion", addCertificacion);
app.post("/api/deleteCertificado", deleteCertificacion);
app.post("/api/addAgrupacion", addAgrupacion);
app.post("/api/deleteAgrupacion", deleteAgrupacion);
app.post("/api/addTitulo", addTitulo);
app.post("/api/deleteTitulo", deleteTitulo);
app.post("/api/addEmpresa", addTrabajaEn);
app.post("/api/deleteEmpresa", deleteTrabajaEn);
app.get("/api/getInfoCuenta", getInfoCuenta);
app.post("/api/updateSettings", updateSettings);
app.post("/api/updateInfoCuenta", updateInfoCuenta);
app.post("/api/checkIfUserHasPreferences", checkIfUserHasPreferences);
app.post("/api/updatePreferences", updatePreferences);

app.get("/api/getAnotherUserData", getAnotherUserData);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
