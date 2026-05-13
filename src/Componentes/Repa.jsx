import { useState } from 'react';
import { PreguntasReparacion } from '../Data/Preg_Repa';
import '../Estilos/ChatBot.css'; 

export default function ChatBotRepa() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);

  const ColoresIconos = ['orange', 'dark-green', 'light-green', 'blue'];

  const [Mensajes, setMensajes] = useState([
    { 
      sender: 'bot', 
      text: '👋 ¡Hola! Bienvenido al servicio de Reparación. Responde las siguientes preguntas.',
      titulo: '¿Qué deseas hacer?'
    },
    { 
      sender: 'bot', 
      text: PreguntasReparacion[0].text, 
      options: PreguntasReparacion[0].options,
      titulo: `Paso 1 de ${PreguntasReparacion.length}`
    }
  ]);

  const handleSelect = (ValorOpc) => {
    const currentQ = PreguntasReparacion[Index];
    const OpcionSelec = currentQ.options.find(opc => opc.value === ValorOpc);

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
      }, 400);
    } else {
      setTerminado(true);
      setTimeout(() => {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: '✅ ¡Perfecto! Has completado las preguntas de reparación. Haz clic abajo para guardar.',
          titulo: 'Finalizado'
        }]);
      }, 400);
    }
  };

  const GuardarBD = async () => {
    const IdRandom = Math.floor(1000 + Math.random() * 9000);
    const NuevoDato = {
      id: IdRandom,
      service: 'Reparación', // ← Identificador para tu backend
      answers: Respuestas
    };

    try {
      const respuesta = await fetch('http://localhost:3001/respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(NuevoDato)
      });

      if (respuesta.ok) {
        setMensajes(anterior => [...anterior, {
          sender: 'bot',
          text: `✅ Guardado con ID #${IdRandom}`
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajes(anterior => [...anterior, {
        sender: 'bot',
        text: '❌ Error al guardar'
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
        {Mensajes[Mensajes.length - 1]?.titulo || "Reparación"}
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
          <button
            onClick={GuardarBD}
            className="save-btn"
          >
            💾 Guardar respuestas en BD
          </button>
        </div>
      )}
    </div>
  );
}
