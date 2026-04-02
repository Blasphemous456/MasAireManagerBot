import { useState} from 'react';
import { Preguntas } from '../Data/Preguntas';
import './ChatBot.css'; // Opcional: estilos básicos

export default function ChatBot() {
  const [Index, setIndex] = useState(0);
  const [Respuestas, setRespuestas] = useState({});
  const [Terminado, setTerminado] = useState(false);

  // 1. Iniciar chat al cargar
const [Mensajes, setMensajes] = useState([
  { sender: 'bot', text: '👋 ¡Hola! Te haré 3 preguntas. Selecciona una opción por cada una.' },
  { sender: 'bot', text: Preguntas[0].text, options: Preguntas[0].options }
]);

  // 2. Manejar selección de opción
  const handleSelect = (optionValue) => {
    const currentQ = Preguntas[Index];
    const selectedOption = currentQ.options.find(opt => opt.value === optionValue);

    // Guardar respuesta
    setRespuestas(prev => ({ ...prev, [Index]: optionValue }));

    // Mostrar mensaje del usuario
    setMensajes(prev => [...prev, { sender: 'user', text: selectedOption.label }]);

    // Avanzar o terminar
    if (Index < Preguntas.length - 1) {
      const nextIndex = Index + 1;
      setIndex(nextIndex);
      // Pequeño delay para simular "escribiendo..."
      setTimeout(() => {
        setMensajes(prev => [...prev, {
          sender: 'bot',
          text: Preguntas[nextIndex].text,
          options: Preguntas[nextIndex].options
        }]);
      }, 400);
    } else {
      setTerminado(true);
      setTimeout(() => {
        setMensajes(prev => [...prev, {
          sender: 'bot',
          text: '✅ ¡Perfecto! Has respondido todas las preguntas. Haz clic abajo para guardar tus respuestas.'
        }]);
      }, 400);
    }
  };

  // 3. Guardar en "base de datos" local
  const saveToDatabase = () => {
    const mockDB = JSON.parse(localStorage.getItem('chatbot_responses') || '[]');
    const newEntry = {
      id: Date.now(),
      answers: Respuestas,
      createdAt: new Date().toLocaleString()
    };
    mockDB.push(newEntry);
    localStorage.setItem('chatbot_responses', JSON.stringify(mockDB));

    setMensajes(prev => [...prev, {
      sender: 'bot',
      text: `💾 Respuestas guardadas correctamente.\n📋 Tus respuestas: ${JSON.stringify(Respuestas)}`
    }]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {Mensajes.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
            {/* Si es mensaje del bot y tiene opciones, renderizar botones */}
            {msg.sender === 'bot' && msg.options && (
              <div className="options">
                {msg.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    disabled={Terminado}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {Terminado && (
        <div className="chat-input">
          <button onClick={saveToDatabase} className="save-btn">
            💾 Guardar respuestas en BD
          </button>
        </div>
      )}
    </div>
  );
}