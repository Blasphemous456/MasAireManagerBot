require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarDB = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

conectarDB();

app.listen(3000, () => {
    console.log("Servidor backend corriendo en puerto 3000");
});