import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';

const DesktopMenuWhite = () => {
  const [menuVisible, setMenuVisible] = useState('');
  const menuRefs = {
    finanzas: useRef(null),
    metas: useRef(null),
    tableros: useRef(null),
    historial: useRef(null),
    reportes: useRef(null)
  };
  const { auth, cerrarSesionAuth } = useAuth();
  const toggleMenu = (menu) => {
    setMenuVisible(prevMenu => (prevMenu === menu ? '' : menu));
  };
  const handleClickOutside = (event) => {
    const isClickInsideAnyMenu = Object.keys(menuRefs).some(
      menu => menuRefs[menu].current && menuRefs[menu].current.contains(event.target)
    );
    if (!isClickInsideAnyMenu) {
      setMenuVisible('');
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleMenuItemClick = () => {
    setMenuVisible('');
  };
  const handleLogout = () => {
    cerrarSesionAuth();
    localStorage.removeItem('token');
  };
  return (
    <nav className="hidden lg:block">
      <div className="flex gap-8 font-semibold uppercase text-sm text-gray-500">
        <Link to={'/'}>
          <p>Producción</p>
        </Link>
        {auth && auth.id && (
          <>
            <div className="relative" ref={menuRefs.finanzas}>
              <button onClick={() => toggleMenu('finanzas')} className="hover:text-gray-900 focus:outline-none uppercase">
                Finanzas
              </button>
              {menuVisible === 'finanzas' && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                  <ul className="py-1 text-slate-700">
                    <li>
                      <Link to={'/finanzas_facturas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Facturas</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="relative" ref={menuRefs.metas}>
              <button onClick={() => toggleMenu('metas')} className="hover:text-gray-900 focus:outline-none uppercase">
                Metas
              </button>
              {menuVisible === 'metas' && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                  <ul className="py-1 text-slate-700">
                    <li>
                      <Link to={'/manuales_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Manuales</p>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/tallado_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de tallado</p>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/generado_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Generadores</p>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/pulido_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Pulido</p>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/engraver_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Engraver</p>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/terminado_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Bloqueo de terminado</p>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/biselado_metas'} onClick={handleMenuItemClick}>
                        <p className="block px-4 py-2 hover:bg-gray-100">Biselado</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
        <div className="relative" ref={menuRefs.tableros}>
          <button onClick={() => toggleMenu('tableros')} className="hover:text-gray-900 focus:outline-none uppercase">
            Tableros
          </button>
          {menuVisible === 'tableros' && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              <ul className="py-1 text-slate-700">
                <li>
                  <Link to={'/tableros_tallado'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Tableros de tallado</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/tableros_terminado'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Tableros de terminado</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/tableros_tallado_terminado'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Tableros de tallado y terminado</p>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="relative" ref={menuRefs.historial}>
          <button onClick={() => toggleMenu('historial')} className="hover:text-gray-900 focus:outline-none uppercase">
            Historial
          </button>
          {menuVisible === 'historial' && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              <ul className="py-1 text-slate-700">
                <li>
                  <Link to={'/historial_por_dia'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Historial por día</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/historial_por_rangos'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Historial por rango de días</p>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="relative" ref={menuRefs.reportes}>
          <button onClick={() => toggleMenu('reportes')} className="hover:text-gray-900 focus:outline-none uppercase">
            Reportes
          </button>
          {menuVisible === 'reportes' && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              <ul className="py-1 text-slate-700">
                <li>
                  <Link to={'/reportes'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">WIP Detallado</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/reportes_antiguedad'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Antigüedad de trabajos</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/reportes_trabajos_nuevos'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">trabajos nuevos</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/reportes_wip_diario'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">wip diario</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/reportes_trabajos_enviados'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Trabajos Enviados</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/reportes_resumen_trabajo'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Resumen de trabajos</p>
                  </Link>
                </li>
                <li>
                  <Link to={'/reportes_trabajos_sin_movimientos'} onClick={handleMenuItemClick}>
                    <p className="block px-4 py-2 hover:bg-gray-100">Trabajos sin movimientos</p>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        {auth && auth.id ? (
          <button onClick={handleLogout} className="hover:text-gray-900 focus:outline-none uppercase">
            Logout
          </button>
        ) : (
          <Link to={'/auth'}>
            <p>Login</p>
          </Link>
        )}
      </div>
    </nav>
  );
};
export default DesktopMenuWhite;