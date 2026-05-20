const Cita = require("../models/Cita");
const Counter = require("../models/Counter");


const generarCustomId = async (servicio) => {
    let prefijo = "";
    switch (servicio) {
        case 'Instalación': prefijo = "Inst-"; break;
        case 'Mantenimiento': prefijo = "Mant-"; break;
        case 'Reparación': prefijo = "Repa-"; break;
        default: prefijo = "Serv-";
    }

    // Incrementa el contador en la BD
    const contador = await Counter.findByIdAndUpdate(
        { _id: servicio },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } 
    );


    const numeroFormateado = contador.seq.toString().padStart(4, '0');

    return `${prefijo}${numeroFormateado}`;
};



// 1. CREAR CITA (POST) 
async function crearCita(req, res) {
    try {
        const { fecha, hora, servicio, nombreCliente, documento, tipoDocumento, telefono, direccion, answers } = req.body;

        // Validar si la hora ya está ocupada
        const citaExistente = await Cita.findOne({ fecha, hora });
        if (citaExistente) {
            return res.status(400).json({ 
                mensaje: "Este horario no se encuentra disponible. Por favor elija otro." 
            });
        }

        const idProfesional = await generarCustomId(servicio);

        const nuevaCita = new Cita({
            customId: idProfesional,
            nombreCliente,
            tipoDocumento,
            documento,
            telefono,
            direccion,
            fecha,
            hora,
            servicio,
            answers
        });

        await nuevaCita.save();


        const [h, m] = hora.split(':');
        const hInt = parseInt(h);
        const ampm = hInt >= 12 ? 'PM' : 'AM';
        const hDisplay = hInt > 12 ? hInt - 12 : hInt;
        const horaFormateada = `${hDisplay}:${m} ${ampm}`;

        res.json({
            mensaje: `Cita para ${servicio}, día ${fecha} a la hora ${horaFormateada} ha sido agendada con éxito`,
            customId: idProfesional
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//  OBTENER TODAS LAS CITAS 
async function obtenerCitas(req, res) {
    try {
        const citas = await Cita.find();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// BUSCAR POR DOCUMENTO 
async function obtenerCitasPorDocumento(req, res) {
    const { doc } = req.params;
    try {
        const citas = await Cita.find({ documento: doc });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//  ACTUALIZAR CITA 
async function actualizarCita(req, res) {
    const { id } = req.params; 
    const datosActualizados = req.body;
    try {
        const citaActualizada = await Cita.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!citaActualizada) {
            return res.status(404).json({ mensaje: "Cita no encontrada" });
        }
        res.json({
            mensaje: "Cita actualizada correctamente",
            cita: citaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ error: error.message });
    }
}

// ELIMINAR CITA (DELETE)
async function eliminarCita(req, res) {
    const { id } = req.params;
    try {
        const citaEliminada = await Cita.findByIdAndDelete(id);
        if (!citaEliminada) {
            return res.status(404).json({ mensaje: "La cita no existe" });
        }
        res.json({ mensaje: "Cita eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { 
    crearCita, 
    obtenerCitas, 
    obtenerCitasPorDocumento,
    actualizarCita, 
    eliminarCita 
};