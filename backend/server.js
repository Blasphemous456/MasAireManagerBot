require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// Coneccion  a la base de datos
conectarDB();

// Registro de las rutas
app.use("/api/citas", require("./routes/citasRoutes"));
console.log("Rutas registradas: /api/citas");


app.listen(3000, () => {
    console.log("Servidor backend corriendo en puerto 3000");
});
