import { useState } from 'react';
import '../Estilos/ChatBot.css';

export default function ConsultarCita() {
    // Estados de búsqueda
    const [nombreBusqueda, setNombreBusqueda] = useState("");
    const [tipoDocBusqueda, setTipoDocBusqueda] = useState("");
    const [documentoBusqueda, setDocumentoBusqueda] = useState("");
    
    // Estados de datos
    const [citasEncontradas, setCitasEncontradas] = useState([]);
    const [error, setError] = useState("");
    const [buscando, setBuscando] = useState(false);

    // Estados de interfaz
    const [modo, setModo] = useState(null); 
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [datosEditados, setDatosEditados] = useState({});

    // --- GENERADOR DE HORARIOS (7 AM - 5 PM) ---
    const generarHorarios = () => {
        const horarios = [];
        for (let h = 7; h <= 17; h++) {
            const period = h >= 12 ? "PM" : "AM";
            const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
            horarios.push({ value: `${h.toString().padStart(2, '0')}:00`, label: `${displayH}:00 ${period}` });
            if (h < 17) {
                horarios.push({ value: `${h.toString().padStart(2, '0')}:30`, label: `${displayH}:30 ${period}` });
            }
        }
        return horarios;
    };

    const getCleanURL = () => {
        let url = import.meta.env.VITE_API_URL;
        return url.endsWith('/') ? url.slice(0, -1) : url;
    };

    const realizarBusqueda = async (e) => {
        if (e) e.preventDefault();
        setBuscando(true);
        setError("");
        setCitasEncontradas([]);
        setModo(null);

        try {
            const response = await fetch(`${getCleanURL()}/cliente/${documentoBusqueda}`);
            if (response.ok) {
                const data = await response.json();
                const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
                const filtradas = data.filter(cita =>
                    norm(cita.nombreCliente) === norm(nombreBusqueda) &&
                    cita.tipoDocumento === tipoDocBusqueda
                );

                if (filtradas.length > 0) setCitasEncontradas(filtradas);
                else setError("⚠️ No se encontraron citas o los datos no coinciden.");
            }
        } catch (err) {
            setError("❌ Error de conexión con MásAire.");
        } finally {
            setBuscando(false);
        }
    };

    const guardarCambios = async () => {
        // Validación básica: que fecha y hora no estén vacías al editar
        if (!datosEditados.fecha || !datosEditados.hora) {
            alert("⚠️ Por favor seleccione una fecha y hora válidas.");
            return;
        }

        try {
            const response = await fetch(`${getCleanURL()}/${citaSeleccionada._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosEditados)
            });

            if (response.ok) {
                alert("✅ Cita reprogramada y datos actualizados con éxito.");
                setModo(null);
                realizarBusqueda();
            } else {
                const errorData = await response.json();
                alert(`❌ ${errorData.mensaje || "Error al actualizar"}`);
            }
        } catch (err) {
            alert("❌ Fallo de red al intentar actualizar.");
        }
    };

    const eliminarCita = async (id, customId) => {
        if (window.confirm(`¿Seguro que deseas CANCELAR la cita ${customId}?`)) {
            try {
                const response = await fetch(`${getCleanURL()}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("🗑️ Cita eliminada correctamente.");
                    setModo(null);
                    realizarBusqueda();
                }
            } catch (err) { alert("❌ Error al intentar eliminar."); }
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <span className="logo-text"><span className="orange">más</span><span className="green">aire</span> manager</span>
            </div>
            <div className="title-bar">
                {modo === 'ver' ? "Información de Cita" : modo === 'editar' ? "Reprogramar Servicio" : "Gestión de Agenda"}
            </div>

            <div className="chat-messages form-view">
                {!modo ? (
                    <>
                        <form onSubmit={realizarBusqueda} className="search-form">
                            <input type="text" placeholder="Nombre completo" value={nombreBusqueda} onChange={e => setNombreBusqueda(e.target.value)} required />
                            <select value={tipoDocBusqueda} onChange={e => setTipoDocBusqueda(e.target.value)} required>
                                <option value="">Tipo Documento</option>
                                <option value="CC">CC</option>
                                <option value="NIT">NIT</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                            <input type="text" placeholder="N° Documento" value={documentoBusqueda} onChange={e => setDocumentoBusqueda(e.target.value)} required />
                            <button type="submit" className="save-btn" disabled={buscando}>🔍 CONSULTAR</button>
                        </form>
                        {error && <div className="error-bubble">{error}</div>}
                        {citasEncontradas.map((cita) => (
                            <div key={cita._id} className="appointment-card">
                                <div className="card-header">
                                    <strong>{cita.customId}</strong>
                                    <span className="service-badge">{cita.servicio}</span>
                                </div>
                                <p style={{fontSize: '0.85rem'}}>📅 {cita.fecha} — ⏰ {cita.hora}</p>
                                <div className="choice-buttons">
                                    <button className="btn-choice-view" onClick={() => { setCitaSeleccionada(cita); setModo('ver'); }}>👁️ Ver</button>
                                    <button className="btn-choice-edit" onClick={() => { setCitaSeleccionada(cita); setDatosEditados({...cita}); setModo('editar'); }}>✏️ Editar</button>
                                    <button className="btn-delete" onClick={() => eliminarCita(cita._id, cita.customId)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : modo === 'ver' ? (
                    <div className="detail-view">
                        <div className="info-box">
                            <h3 style={{color: '#00695c'}}>{citaSeleccionada.servicio}</h3>
                            <p>🏷️ <strong>Código:</strong> {citaSeleccionada.customId}</p>
                            <p>📅 <strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
                            <p>⏰ <strong>Hora:</strong> {citaSeleccionada.hora}</p>
                            <p>📍 <strong>Dirección:</strong> {citaSeleccionada.direccion}</p>
                            <p>📞 <strong>Teléfono:</strong> {citaSeleccionada.telefono}</p>
                        </div>
                        <button className="back-btn" onClick={() => setModo(null)}>Volver</button>
                        <button className="cancel-btn-red" onClick={() => eliminarCita(citaSeleccionada._id, citaSeleccionada.customId)}>❌ Cancelar Cita</button>
                    </div>
                ) : (
                    <div className="edit-view">
                        <h3>Editar Cita {datosEditados.customId}</h3>
                        
                        <label className="input-label">Dirección:</label>
                        <input type="text" value={datosEditados.direccion} onChange={e => setDatosEditados({...datosEditados, direccion: e.target.value})} />
                        
                        <label className="input-label">Teléfono:</label>
                        <input type="text" value={datosEditados.telefono} onChange={e => setDatosEditados({...datosEditados, telefono: e.target.value})} />
                        
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            <div style={{flex: 1}}>
                                <label className="input-label">Nueva Fecha:</label>
                                <input type="date" value={datosEditados.fecha} onChange={e => setDatosEditados({...datosEditados, fecha: e.target.value})} />
                            </div>
                            <div style={{flex: 1}}>
                                <label className="input-label">Nueva Hora:</label>
                                <select value={datosEditados.hora} onChange={e => setDatosEditados({...datosEditados, hora: e.target.value})}>
                                    {generarHorarios().map(h => (
                                        <option key={h.value} value={h.value}>{h.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="edit-actions" style={{marginTop: '20px'}}>
                            <button className="confirm-btn" onClick={guardarCambios}>💾 Guardar Cambios</button>
                            <button className="back-btn" onClick={() => setModo(null)}>Descartar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}