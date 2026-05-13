import { useState } from 'react';
import ChatBotInstalacion from './Componentes/Inst';
import ChatBotMantenimiento from './Componentes/Mant';
import ChatBotReparacion from './Componentes/Repa';
import './App.css';

function App() {
  const [servicioActivo, setServicioActivo] = useState(null);

  const renderizarChatbot = () => {
    switch(servicioActivo) {
      case 'instalacion':
        return <ChatBotInstalacion onVolver={() => setServicioActivo(null)} />;
      case 'mantenimiento':
        return <ChatBotMantenimiento onVolver={() => setServicioActivo(null)} />;
      case 'reparacion':
        return <ChatBotReparacion onVolver={() => setServicioActivo(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {!servicioActivo ? (
        <div className="menu-principal">
          
          <div className="chat-header">
            <div className="logo-text">
              <span className="orange">más</span><span className="green">aire</span> manager bot
            </div>
          </div>

          <div className="title-bar">
            ¿Qué deseas hacer?
          </div>

          <div className="menu-content">
            <div className="servicios-container">
              
              {/* Instalación */}
              <div 
                className="servicio-card"
                onClick={() => setServicioActivo('instalacion')}
              >
                <span className="icon-circle orange">🛠️</span>
                <h3 className="card-title">Instalación</h3>
                <div className="card-arrow">→</div>
              </div>

              {/* Mantenimiento */}
              <div 
                className="servicio-card"
                onClick={() => setServicioActivo('mantenimiento')}
              >
                <span className="icon-circle dark-green">🔧</span>
                <h3 className="card-title">Mantenimiento</h3>
                <div className="card-arrow">→</div>
              </div>

              {/* Reparación */}
              <div 
                className="servicio-card"
                onClick={() => setServicioActivo('reparacion')}
              >
                <span className="icon-circle light-green">🔩</span>
                <h3 className="card-title">Reparación</h3>
                <div className="card-arrow">→</div>
              </div>

            </div>
          </div>

          <div className="footer">
            <p>© másaire - 2016 - todos los derechos reservados</p>
          </div>
        </div>
      ) : (
        <div className="chatbot-wrapper">
          <button className="btn-volver" onClick={() => setServicioActivo(null)}>
            ← Volver al menú
          </button>
          {renderizarChatbot()}
        </div>
      )}
    </div>
  );
}

export default App;