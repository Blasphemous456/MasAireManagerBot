const express = require("express");
const router = express.Router();
const { crearCita, obtenerCitas } = require("../controllers/citasController");

// GET todas las citas
router.get("/", obtenerCitas);

// POST nueva cita
router.post("/", crearCita);

module.exports = router;
