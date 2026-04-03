function generarHorarioIA(citas) {

    let hora = 8;

    if (citas.length > 0) {

        const ultima = citas[citas.length - 1];

        const fechaUltima = new Date(ultima.fecha);

        hora = fechaUltima.getHours() + 1;

    }

    const nuevaFecha = new Date();

    if (hora >= 17) {
        nuevaFecha.setDate(nuevaFecha.getDate() + 1);
        hora = 8;
    }

    nuevaFecha.setHours(hora);
    nuevaFecha.setMinutes(0);
    nuevaFecha.setSeconds(0);

    return nuevaFecha;
}

module.exports = {
    generarHorarioIA
};