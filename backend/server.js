require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/database");

const app = express();

app.use(cors({ 
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"] 
}));

app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Conexion  a la base de datos
conectarDB();

// Registro de las rutas
app.use("/api/citas", require("./routes/citasRoutes"));
console.log("Rutas registradas: /api/citas");


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
});

