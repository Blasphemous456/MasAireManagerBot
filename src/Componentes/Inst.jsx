import { useState } from 'react';
import { PreguntasInstalacion } from '../Data/Preg_Inst';
import '../Estilos/ChatBot.css';

export default function ChatBotInst() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);
  const ColoresIconos = ['orange', 'dark-green', 'light-green', 'blue'];

  // Estados para los datos del cliente
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [servicio, setServicio] = useState("");

  // Estados para la Dirección Estándar de Colombia
  const [tipoVia, setTipoVia] = useState("");         
  const [numeroVia, setNumeroVia] = useState("");     
  const [orientacion, setOrientacion] = useState(""); 
  const [placaNumero, setPlacaNumero] = useState(""); 
  const [complemento, setComplemento] = useState(""); 

  const [Mensajes, setMensajes] = useState([
    {
      sender: 'bot',
      text: '👋 ¡Hola! Te haré 3 preguntas sobre tu instalación. Selecciona una opción por cada una.',
      titulo: '¿Qué deseas hacer?'
    },
    {
      sender: 'bot',
      text: PreguntasInstalacion[0].text,
      options: PreguntasInstalacion[0].options,
      titulo: `Paso 1 de ${PreguntasInstalacion.length}`
    }
  ]);

  const handleSelect = (ValorOpc) => {
    const currentQ = PreguntasInstalacion[Index];
    const OpcionSelec = currentQ.options?.find(opc => opc.value === ValorOpc);

    setRespuestas(anterior => ({ ...anterior, [Index]: ValorOpc }));
    if (OpcionSelec) {
      setMensajes(anterior => [...anterior, { sender: 'user', text: OpcionSelec.label }]);
    }

    if (Index < PreguntasInstalacion.length - 1) {
      const SigIndex = Index + 1;
      setIndex(SigIndex);
      setTimeout(() => {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: PreguntasInstalacion[SigIndex].text,
          options: PreguntasInstalacion[SigIndex].options,
          titulo: `Paso ${SigIndex + 1} de ${PreguntasInstalacion.length}`
        }]);
      }, 800);
    } else {
      setTerminado(true);
      setTimeout(() => {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: '✅ ¡Perfecto! Has respondido todas las preguntas. Ahora llena tus datos para agendar la cita.',
          titulo: 'Finalizado'
        }]);
      }, 800);
    }
  };

  const GuardarBD = async () => {
    // Uso obligatorio de backticks (`) para evitar el [PARSE_ERROR]
    const direccionCompleta = `${tipoVia} ${numeroVia} # ${orientacion} - ${placaNumero} ${complemento}`.trim();

    const NuevoDato = {
      nombreCliente,
      tipoDocumento,
      documento,
      telefono,
      direccion: direccionCompleta,
      fecha,
      servicio,
      answers: Respuestas
    };

    console.log("NuevoDato enviado al backend:", NuevoDato);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(NuevoDato)
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        setMensajes(anterior => [...anterior, { sender: 'bot', text: `✅ ${data.mensaje}` }]);
      } else {
        setMensajes(anterior => [...anterior, { sender: 'bot', text: '❌ Error al guardar en BD' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajes(anterior => [...anterior, { sender: 'bot', text: '❌ Error al conectar con el backend' }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="logo-text"><span className="orange">más</span><span className="green">aire</span> manager bot</span>
      </div>

      <div className="title-bar">
        {Mensajes[Mensajes.length - 1]?.titulo || "Instalación"}
      </div>

      <div className="chat-messages">
        {Mensajes.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
            {msg.sender === 'bot' && msg.options && (
              <div className="options">
                {msg.options.map((opt, optIdx) => (
                  <button
                    key={opt.value}
                    className="option-btn"
                    onClick={() => handleSelect(opt.value)}
                    disabled={Terminado}
                  >
                    <span className={`icon-circle ${ColoresIconos[optIdx % ColoresIconos.length]}`}>
                      {opt.label.charAt(0)}
                    </span>
                    <span className="option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {Terminado && (
        <div className="chat-footer">
          <h3>Datos del cliente</h3>
          <input type="text" placeholder="Nombre del cliente" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
          
          <select value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)}>
            <option value="">Seleccione tipo de documento</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="NIT">NIT (Empresas)</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
          </select>

          <input type="text" placeholder="Número de documento" value={documento} onChange={e => setDocumento(e.target.value)} />
          <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />

          {/* Dirección Estandarizada Colombia con Orientación */}
          <div className="address-container">
            <label className="input-label">Dirección de la Cita</label>
            <div className="address-grid">
              <select value={tipoVia} onChange={e => setTipoVia(e.target.value)} className="address-select">
                <option value="">Tipo</option>
                <option value="Calle">Calle</option>
                <option value="Carrera">Carrera</option>
                <option value="Avenida">Avenida</option>
                <option value="Diagonal">Diagonal</option>
                <option value="Transversal">Transversal</option>
              </select>
              <input type="text" placeholder="N°" value={numeroVia} onChange={e => setNumeroVia(e.target.value)} style={{width: '50px'}} />
              <span className="address-symbol">#</span>
              <select value={orientacion} onChange={e => setOrientacion(e.target.value)} className="address-select">
                <option value="">Orientación</option>
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
                <option value="Este">Este</option>
                <option value="Oeste">Oeste</option>
                <option value="Noroccidente">Noroccidente</option>
                <option value="Suroccidente">Suroccidente</option>
                <option value="Nororiente">Nororiente</option>
                <option value="Suroriente">Suroriente</option>
              </select>
              <span className="address-symbol">-</span>
              <input type="text" placeholder="N°" value={placaNumero} onChange={e => setPlacaNumero(e.target.value)} style={{width: '50px'}} />
            </div>
            <input type="text" placeholder="Apto, Bloque o Barrio" value={complemento} onChange={e => setComplemento(e.target.value)} className="address-extra" />
          </div>

          {/* Fecha con Título y Calendario Nativo */}
          <div className="input-group">
            <label className="input-label">Indique la fecha de la cita deseada</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="date-input" />
          </div>

          <select value={servicio} onChange={e => setServicio(e.target.value)}>
            <option value="">Seleccione servicio</option>
            <option value="Instalación">Instalación</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Reparación">Reparación</option>
          </select>

          <button onClick={GuardarBD} className="save-btn">
            💾 Guardar respuestas en BD
          </button>
        </div>
      )}
    </div>
  );
}

