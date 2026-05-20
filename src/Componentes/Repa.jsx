import { useState } from 'react';
import { PreguntasReparacion } from '../Data/Preg_Repa'; // Cambio específico
import '../Estilos/ChatBot.css';

export default function ChatBotRepa() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);
  const [AgendadoExitoso, setAgendadoExitoso] = useState(false);
  const [RespuestaServidor, setRespuestaServidor] = useState(null);

  const [Mensajes, setMensajes] = useState([
    { sender: 'bot', text: '👋 ¡Hola! Sentimos los fallos de tu aire. Ayúdanos con estas preguntas para el técnico.', titulo: 'Soporte Técnico / Reparación' },
    { sender: 'bot', text: PreguntasReparacion[0].text, options: PreguntasReparacion[0].options, titulo: `Paso 1 de ${PreguntasReparacion.length}` }
  ]);

  const ColoresIconos = ['light-green', 'orange', 'dark-green', 'blue'];

  // Estados del cliente
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // Estados dirección
  const [tipoVia, setTipoVia] = useState("");
  const [numeroVia, setNumeroVia] = useState("");
  const [orientacion, setOrientacion] = useState("");
  const [placaNumero, setPlacaNumero] = useState("");
  const [complemento, setComplemento] = useState("");

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

  const formularioCompleto =
    nombreCliente.trim() !== "" && tipoDocumento !== "" && documento.trim() !== "" &&
    telefono.trim() !== "" && tipoVia !== "" && numeroVia.trim() !== "" &&
    orientacion !== "" && placaNumero.trim() !== "" && fecha !== "" && hora !== "";

  const handleSelect = (ValorOpc) => {
    const currentQ = PreguntasReparacion[Index];
    const OpcionSelec = currentQ.options?.find(opc => opc.value === ValorOpc);
    setRespuestas(anterior => ({ ...anterior, [Index]: ValorOpc }));
    setMensajes(anterior => [...anterior, { sender: 'user', text: OpcionSelec.label }]);

    if (Index < PreguntasReparacion.length - 1) {
      const SigIndex = Index + 1;
      setIndex(SigIndex);
      setTimeout(() => {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: PreguntasReparacion[SigIndex].text,
          options: PreguntasReparacion[SigIndex].options,
          titulo: `Paso ${SigIndex + 1} de ${PreguntasReparacion.length}`
        }]);
      }, 600);
    } else {
      setTimeout(() => setTerminado(true), 600);
    }
  };

  const GuardarBD = async () => {
    const direccionCompleta = `${tipoVia} ${numeroVia} # ${orientacion} - ${placaNumero} ${complemento}`.trim();
    const NuevoDato = {
      nombreCliente, tipoDocumento, documento, telefono,
      direccion: direccionCompleta, fecha, hora,
      servicio: "Reparación", // Cambio específico
      answers: Respuestas
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(NuevoDato)
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        setRespuestaServidor(data);
        setAgendadoExitoso(true);
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("❌ Error de conexión");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="logo-text"><span className="orange">más</span><span className="green">aire</span> manager</span>
      </div>

      <div className="title-bar">
        {AgendadoExitoso ? "Confirmación" : "Solicitar Reparación"}
      </div>

      <div className="chat-messages">
        {!AgendadoExitoso && Mensajes.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
            {msg.sender === 'bot' && msg.options && !Terminado && (
              <div className="options">
                {msg.options.map((opt, optIdx) => (
                  <button key={opt.value} className="option-btn" onClick={() => handleSelect(opt.value)}>
                    <span className={`icon-circle ${ColoresIconos[optIdx % ColoresIconos.length]}`}>{opt.label.charAt(0)}</span>
                    <span className="option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {AgendadoExitoso && (
          <div className="success-confirmation">
            <div className="success-icon">🛠️</div>
            <h3>¡Reparación Agendada!</h3>
            <p>{RespuestaServidor.mensaje}</p>
            <div className="ticket-info">
              <strong>Número de Orden:</strong>
              <span>{RespuestaServidor.customId}</span>
            </div>
            <button className="save-btn" onClick={() => window.location.reload()}>Finalizar</button>
          </div>
        )}
      </div>

      {Terminado && !AgendadoExitoso && (
        <div className="chat-footer">
          <input type="text" placeholder="Nombre completo" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
          <div style={{ display: 'flex', gap: '5px' }}>
            <select value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)} style={{ flex: 1 }}>
              <option value="">Doc</option>
              <option value="CC">CC</option>
              <option value="NIT">NIT</option>
              <option value="CE">CE</option>
            </select>
            <input type="text" placeholder="Número" value={documento} onChange={e => setDocumento(e.target.value)} style={{ flex: 2 }} />
          </div>
          <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />

          <div className="address-container">
            <div className="address-grid">
              <select value={tipoVia} onChange={e => setTipoVia(e.target.value)} className="address-select">
                <option value="">Vía</option>
                <option value="Calle">Cl.</option>
                <option value="Carrera">Cr.</option>
                <option value="Avenida">Av.</option>
                <option value="Diagonal">Diag.</option>
              </select>
              <input type="text" placeholder="N°" value={numeroVia} onChange={e => setNumeroVia(e.target.value)} style={{ width: '40px' }} />
              <span>#</span>
              <select value={orientacion} onChange={e => setOrientacion(e.target.value)} className="address-select">
                <option value="">Ori.</option>
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
                <option value="Noroccidente">Nocc</option>
                <option value="Suroccidente">Socc</option>
              </select>
              <span>-</span>
              <input type="text" placeholder="N°" value={placaNumero} onChange={e => setPlacaNumero(e.target.value)} style={{ width: '40px' }} />
            </div>
            <input type="text" placeholder="Apto / Barrio" value={complemento} onChange={e => setComplemento(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label">Fecha de revisión</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="input-label">Horario deseado</label>
              <select value={hora} onChange={e => setHora(e.target.value)}>
                <option value="">Seleccione</option>
                {generarHorarios().map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
          </div>

          {formularioCompleto && (
            <button onClick={GuardarBD} className="save-btn animated-button" style={{ marginTop: '15px', background: 'linear-gradient(135deg, #00796b 0%, #004d40 100%)' }}>
              📅 SOLICITAR TÉCNICO DE REPARACIÓN
            </button>
          )}
        </div>
      )}
    </div>
  );
}