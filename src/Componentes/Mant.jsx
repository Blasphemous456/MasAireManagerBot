import { useState } from 'react';
import { PreguntasMantenimiento } from '../Data/Preg_Mant'; // Cambio específico
import '../Estilos/ChatBot.css';

export default function ChatBotMant() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);
  const [AgendadoExitoso, setAgendadoExitoso] = useState(false);
  const [RespuestaServidor, setRespuestaServidor] = useState(null);

  const [Mensajes, setMensajes] = useState([
    { sender: 'bot', text: '👋 ¡Hola! Iniciemos con el proceso de mantenimiento de tu equipo.', titulo: 'Mantenimiento Preventivo' },
    { sender: 'bot', text: PreguntasMantenimiento[0].text, options: PreguntasMantenimiento[0].options, titulo: `Paso 1 de ${PreguntasMantenimiento.length}` }
  ]);

  const ColoresIconos = ['dark-green', 'orange', 'light-green', 'blue'];

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
    const currentQ = PreguntasMantenimiento[Index];
    const OpcionSelec = currentQ.options?.find(opc => opc.value === ValorOpc);
    setRespuestas(anterior => ({ ...anterior, [Index]: ValorOpc }));
    setMensajes(anterior => [...anterior, { sender: 'user', text: OpcionSelec.label }]);

    if (Index < PreguntasMantenimiento.length - 1) {
      const SigIndex = Index + 1;
      setIndex(SigIndex);
      setTimeout(() => {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: PreguntasMantenimiento[SigIndex].text,
          options: PreguntasMantenimiento[SigIndex].options,
          titulo: `Paso ${SigIndex + 1} de ${PreguntasMantenimiento.length}`
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
      servicio: "Mantenimiento", // Cambio específico
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
        {AgendadoExitoso ? "Confirmación" : "Agenda tu Mantenimiento"}
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
            <div className="success-icon">✅</div>
            <h3>¡Agendamiento Exitoso!</h3>
            <p>{RespuestaServidor.mensaje}</p>
            <div className="ticket-info">
              <strong>Código de servicio:</strong>
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
              <option value="Pasaporte">Pasaporte</option>
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
                <option value="Este">Este</option>
                <option value="Oeste">Oeste</option>
                <option value="Noroccidente">Nocc</option>
              </select>
              <span>-</span>
              <input type="text" placeholder="N°" value={placaNumero} onChange={e => setPlacaNumero(e.target.value)} style={{ width: '40px' }} />
            </div>
            <input type="text" placeholder="Apto / Barrio" value={complemento} onChange={e => setComplemento(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label">Fecha de mantenimiento</label>
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
            <button onClick={GuardarBD} className="save-btn animated-button" style={{ marginTop: '15px', background: 'linear-gradient(135deg, #004d40 0%, #00251a 100%)' }}>
              📅 CONFIRMAR MANTENIMIENTO
            </button>
          )}
        </div>
      )}
    </div>
  );
}