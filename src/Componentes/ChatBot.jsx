import { useState } from 'react';
import { Preguntas } from '../Data/Preguntas';
import '../Estilos/ChatBot.css'; 

export default function ChatBot() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);
  const ColoresIconos = ['orange', 'dark-green', 'light-green', 'blue'];

  // Estados para los datos del cliente
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState("");
  const [servicio, setServicio] = useState("");

  const [Mensajes, setMensajes] = useState([
    { 
      sender: 'bot', 
      text: '👋 ¡Hola! Te haré 3 preguntas sobre tu instalación. Selecciona una opción por cada una.',
      titulo: '¿Qué deseas hacer?' 
    },
    { 
      sender: 'bot', 
      text: Preguntas[0].text, 
      options: Preguntas[0].options,
      titulo: `Paso 1 de ${Preguntas.length}`
    }
  ]);

  const handleSelect = (ValorOpc) => {
    const currentQ = Preguntas[Index];
    const OpcionSelec = currentQ.options?.find(opc => opc.value === ValorOpc);

    setRespuestas(anterior => ({ ...anterior, [Index]: ValorOpc }));
    if (OpcionSelec) {
      setMensajes(anterior => [...anterior, { sender: 'user', text: OpcionSelec.label }]);
    }

    if (Index < Preguntas.length - 1) {
      const SigIndex = Index + 1;
      setIndex(SigIndex);
      
      setTimeout(() => {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: Preguntas[SigIndex].text,
          options: Preguntas[SigIndex].options,
          titulo: `Paso ${SigIndex + 1} de ${Preguntas.length}`
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
    const NuevoDato = {
      nombreCliente,
      tipoDocumento,
      documento,
      telefono,
      direccion,
      fecha,
      servicio,
      answers: Respuestas
    };

    // 🔎 Aquí ves exactamente qué JSON se envía
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
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: `✅ ${data.mensaje}`
        }]);
      } else {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: '❌ Error al guardar en BD'
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajes(anterior => [...anterior, {
        sender: 'bot',
        text: '❌ Error al conectar con el backend'
      }]);
    }
  };

  return (
    <div className="chat-container">
      
      <div className="chat-header">
        <div className="logo-text">
          <span className="orange">más</span><span className="green">aire</span> manager bot
        </div>
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
          <input type="text" placeholder="Tipo de documento (CC, TI, Pasaporte)" value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)} />
          <input type="text" placeholder="Número de documento" value={documento} onChange={e => setDocumento(e.target.value)} />
          <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
          <input type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
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
