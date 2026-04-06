import { useState } from 'react';
import { Preguntas } from '../Data/Preguntas';
import '../Estilos/ChatBot.css'; 

export default function ChatBot() {
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
      text: Preguntas[0].text, 
      options: Preguntas[0].options,
      titulo: `Paso 1 de ${Preguntas.length}` // ← Nuevo
    }
  ]);

  const handleSelect = (ValorOpc) => {
    const currentQ = Preguntas[Index];
    const OpcionSelec = currentQ.options.find(opc => opc.value === ValorOpc);

    setRespuestas(anterior => ({ ...anterior, [Index]: ValorOpc }));
    setMensajes(anterior => [...anterior, { sender: 'user', text: OpcionSelec.label }]);

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
          text: '✅ ¡Perfecto! Has respondido todas las preguntas. Haz clic abajo para guardar tus respuestas.',
          titulo: 'Finalizado' // ← Nuevo
        }]);
      }, 800);
    }
  };

  // 3. Guardar en "base de datos" local
  const GuardarBD = () => {
    const BuscarLS = JSON.parse(localStorage.getItem('chatbot_respuestas') || '[]');
    const NuevoDato = {
      id: Date.now(),
      answers: Respuestas,
      createdAt: new Date().toLocaleString()
    };
    BuscarLS.push(NuevoDato);
    localStorage.setItem('chatbot_respuestas', JSON.stringify(BuscarLS));

    setMensajes(anterior => [...anterior, {
      sender: 'bot',
      text: `💾 Respuestas guardadas correctamente.\n📋 Tus respuestas: ${JSON.stringify(Respuestas)}`
    }]);
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
          <button onClick={GuardarBD} className="save-btn">
            💾 Guardar respuestas en BD
          </button>
        </div>
      )}
    </div>
  );
}