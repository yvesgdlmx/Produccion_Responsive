import React, { useState, useEffect } from 'react';
import Totales_Generado_Tableros from '../../components/tableros/Totales_Generado_Tableros';
import Totales_Pulido_Tableros from '../../components/tableros/Totales_Pulido_Tableros'
import Totales_Tallado_Tableros from '../../components/tableros/Totales_Tallado_Tableros';
import Totales_Engraver_Tableros from '../../components/tableros/Totales_Engraver_Tableros';

const Tableros_Tallado = () => {
  const componentes = ['TotalesTallado', 'TotalesGenerado', 'TotalesPulido', 'TotalesEngraver'];
  const [componenteActivo, setComponenteActivo] = useState(componentes[0]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setComponenteActivo(prev => {
        const currentIndex = componentes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % componentes.length;
        return componentes[nextIndex];
      });
    }, 10000); // Cambia cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const togglePantallaCompleta = () => {
    const elem = document.getElementById('componente-activo');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  };

  return (
    <div>
      <button className='bg-blue-500 text-white font-bold uppercase p-2 rounded-md mb-6 hover:bg-blue-600 transition duration-300 ease-in-out ml-4' onClick={togglePantallaCompleta}>Pantalla Completa</button>
      <div
        id="componente-activo"
        style={{
          display: isFullScreen ? 'flex' : 'block',
          justifyContent: isFullScreen ? 'center' : 'initial',
          alignItems: isFullScreen ? 'center' : 'initial',
          height: isFullScreen ? '100vh' : 'auto',
          width: isFullScreen ? '100%' : 'auto',
        }}
      >
        {componenteActivo === 'TotalesTallado' && <Totales_Tallado_Tableros/>}
        {componenteActivo === 'TotalesGenerado' && <Totales_Generado_Tableros />}
        {componenteActivo === 'TotalesPulido' && <Totales_Pulido_Tableros />}
        {componenteActivo === 'TotalesEngraver' && <Totales_Engraver_Tableros />}
      </div>
    </div>
  );
};

export default Tableros_Tallado;