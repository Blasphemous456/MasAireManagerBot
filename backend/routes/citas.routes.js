const express = require("express");
const router = express.Router();

const {
    agendarCita,
    obtenerCitas
} = require("../controllers/citas.controller");

router.post("/agendar", agendarCita);

router.get("/", obtenerCitas);

module.exports = router;