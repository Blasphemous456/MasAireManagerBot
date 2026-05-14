import { useState } from 'react';
import ChatBotInstalacion from './Componentes/Inst';
import ChatBotMantenimiento from './Componentes/Mant';
import ChatBotReparacion from './Componentes/Repa';
import ConsultarCita from './Componentes/ConsultarCita'; 
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
      case 'consulta': // 2. Caso para gestionar citas
        return <ConsultarCita onVolver={() => setServicioActivo(null)} />;
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
            ¿Qué deseas hacer hoy?
          </div>

          <div className="menu-content">
            <div className="servicios-container">
              
              {/* Opción: Instalación */}
              <div 
                className="servicio-card"
                onClick={() => setServicioActivo('instalacion')}
              >
                <span className="icon-circle orange">🛠️</span>
                <h3 className="card-title">Agendar Instalación</h3>
                <div className="card-arrow">→</div>
              </div>

              {/* Opción: Mantenimiento */}
              <div 
                className="servicio-card"
                onClick={() => setServicioActivo('mantenimiento')}
              >
                <span className="icon-circle dark-green">🔧</span>
                <h3 className="card-title">Agendar Mantenimiento</h3>
                <div className="card-arrow">→</div>
              </div>

              {/* Opción: Reparación */}
              <div 
                className="servicio-card"
                onClick={() => setServicioActivo('reparacion')}
              >
                <span className="icon-circle light-green">🔩</span>
                <h3 className="card-title">Agendar Reparación</h3>
                <div className="card-arrow">→</div>
              </div>

              {/* 3. NUEVA OPCIÓN: Gestionar / Consultar Citas */}
              <div 
                className="servicio-card consulta-card" 
                style={{borderTop: '2px dashed #ccc', marginTop: '10px'}}
                onClick={() => setServicioActivo('consulta')}
              >
                <span className="icon-circle blue">🔍</span>
                <h3 className="card-title">Gestionar mis Citas</h3>
                <p style={{fontSize: '0.7rem', color: '#666', position: 'absolute', bottom: '10px', left: '65px'}}>
                  Ver, modificar o cancelar
                </p>
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
            ← Volver al menú principal
          </button>
          {renderizarChatbot()}
        </div>
      )}
    </div>
  );
}

export default App;