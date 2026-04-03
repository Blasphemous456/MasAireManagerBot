const fs = require("fs");
const path = require("path");

const {
    generarHorarioIA
} = require("../services/ia.service");

const filePath = path.join(__dirname, "../data/citas.json");

function leerCitas() {
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function guardarCitas(citas) {
    fs.writeFileSync(filePath, JSON.stringify(citas, null, 2));
}

function agendarCita(req, res) {

    const { nombre, telefono, servicio } = req.body;

    let citas = leerCitas();

    const horario = generarHorarioIA(citas);

    const nuevaCita = {
        id: Date.now(),
        nombre,
        telefono,
        servicio,
        fecha: horario
    };

    citas.push(nuevaCita);

    guardarCitas(citas);

    res.json({
        mensaje: "Cita agendada correctamente",
        cita: nuevaCita
    });
}

function obtenerCitas(req, res) {
    const citas = leerCitas();
    res.json(citas);
}

module.exports = {
    agendarCita,
    obtenerCitas
};