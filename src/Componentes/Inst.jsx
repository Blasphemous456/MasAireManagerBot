import { useState } from 'react';
import { PreguntasInstalacion } from '../Data/Preg_Inst';
import '../Estilos/ChatBot.css'; 

export default function ChatBotInst() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);
  const ColoresIconos = ['orange', 'dark-green', 'light-green', 'blue'];

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
    const OpcionSelec = currentQ.options.find(opc => opc.value === ValorOpc);

    setRespuestas(anterior => ({ ...anterior, [Index]: ValorOpc }));
    setMensajes(anterior => [...anterior, { sender: 'user', text: OpcionSelec.label }]);

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
          text: '✅ ¡Perfecto! Has respondido todas las preguntas. Haz clic abajo para guardar tus respuestas.',
          titulo: 'Finalizado' // ← Nuevo
        }]);
      }, 800);
    }
  };


  const GuardarBD = async () => {
  const IdRandom = Math.floor(1000 + Math.random() * 9000);
  
  const NuevoDato = {
    id: IdRandom,
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

