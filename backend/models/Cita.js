const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema(
    {
        nombreCliente: {
            type: String,
            required: true
        },
        tipoDocumento: {
            type: String,
            required: true
        },
        documento: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },
        fecha: {
            type: String,
            required: true
        },
        servicio: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cita", citaSchema);