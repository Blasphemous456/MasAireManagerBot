const express = require("express");
const router = express.Router();
const { agendarCita, obtenerCitas } = require("../controllers/citasController");

// GET todas las citas
router.get("/", obtenerCitas);

// POST nueva cita
router.post("/", agendarCita);

module.exports = router;
