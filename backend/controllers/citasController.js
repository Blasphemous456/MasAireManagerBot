const { generarHorarioIA } = require("../services/iaService");
const Cita = require("../models/Cita");

// Crear nueva cita
async function agendarCita(req, res) {
    try {
        const { nombreCliente, tipoDocumento, documento, telefono, direccion, fecha, servicio } = req.body;

        // Obtener citas existentes desde Mongo
        const citas = await Cita.find();

        // Generar horario con el servicio IA
        const horario = generarHorarioIA(citas);

        // Crear nueva cita 
        const nuevaCita = new Cita({
            nombreCliente,
            tipoDocumento,
            documento,
            telefono,
            direccion,
            fecha: horario || fecha,
            servicio
        });


        const citaGuardada = await nuevaCita.save();

        res.json({
            mensaje: "Cita agendada correctamente",
            cita: citaGuardada
        });
    } catch (error) {
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

module.exports = {
    agendarCita,
    obtenerCitas
};
