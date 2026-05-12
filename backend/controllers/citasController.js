const { generarHorarioIA } = require("../services/iaService");
const Cita = require("../models/Cita");

// Crea nueva cita
async function crearCita(req, res) {
    console.log("Body recibido:", req.body);
    try {
        // cuerpo recibido desde el frontend
        const datos = req.body;

        // Obtiene las citas existentes desde Mongo
        const citas = await Cita.find();

        // Generar el horario
        const horario = generarHorarioIA(citas);

        // Crea una nueva cita con los datos recibidos
        const nuevaCita = new Cita({
            ...datos,
            fecha: horario || datos.fecha // usa el horario generado o la fecha enviada
        });

        const citaGuardada = await nuevaCita.save();

        res.json({
            mensaje: "Cita agendada correctamente",
            cita: citaGuardada
        });
    } catch (error) {
        console.error("Error al guardar cita:", error);
        res.status(500).json({ error: error.message });
    }
}

// Obtiene todas las citas
async function obtenerCitas(req, res) {
    try {
        const citas = await Cita.find();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { crearCita, obtenerCitas };

