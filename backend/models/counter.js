const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // 'Instalación', 'Mantenimiento' o 'Reparación'
    seq: { type: Number, default: 0 }
});

module.exports = mongoose.model("Counter", counterSchema);