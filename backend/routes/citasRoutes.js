const express = require("express");
const router = express.Router();
// Importamos todas las funciones del controlador corregido
const { 
    crearCita, 
    obtenerCitas, 
    obtenerCitasPorDocumento, 
    actualizarCita, 
    eliminarCita 
} = require("../controllers/citasController");

// Ruta para crear (Chatbot)
router.post("/", crearCita);

// Ruta para ver todas (Admin)
router.get("/", obtenerCitas);


router.get("/cliente/:doc", obtenerCitasPorDocumento);

// Rutas para actualizar y eliminar
router.put("/:id", actualizarCita);
router.delete("/:id", eliminarCita);

module.exports = router;