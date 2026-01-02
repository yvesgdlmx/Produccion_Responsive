import React, { useRef } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { obtenerImagenEquipo, obtenerEstiloImagen } from '../../helpers/fracttal/Funciones';
import useFracttal from '../../../hooks/fracttal/useFracttal';

const FracttalProcesos = () => {
  const { equipos, equiposAgrupados, loading, error } = useFracttal();
  const scrollRefs = useRef({});

  const scroll = (nombreGrupo, direction) => {
    const container = scrollRefs.current[nombreGrupo];
    if (container) {
      const scrollAmount = 350;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>Cargando equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md'>
          <div className='text-red-600 text-center'>
            <svg className='w-16 h-16 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <h2 className='text-2xl font-bold mb-2'>Error al cargar datos</h2>
            <p className='text-gray-600'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
      <div className='mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Gestión de Equipos</h1>
          <p className='text-gray-600'>Total de equipos: <span className='font-semibold text-blue-600'>{equipos.length}</span></p>
        </div>
        
        <div className='space-y-8'>
          {Object.keys(equiposAgrupados).sort().map(nombreGrupo => (
            <div key={nombreGrupo} className='bg-white rounded-xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800'>{nombreGrupo}</h2>
                  <p className='text-sm text-gray-500 mt-1'>{equiposAgrupados[nombreGrupo].length} equipos disponibles</p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => scroll(nombreGrupo, 'left')}
                    className='p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-md hover:shadow-lg'
                    aria-label='Scroll izquierda'
                  >
                    <IoChevronBack size={24} />
                  </button>
                  <button
                    onClick={() => scroll(nombreGrupo, 'right')}
                    className='p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-md hover:shadow-lg'
                    aria-label='Scroll derecha'
                  >
                    <IoChevronForward size={24} />
                  </button>
                </div>
              </div>

              <div 
                ref={(el) => scrollRefs.current[nombreGrupo] = el}
                className='flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide'
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {equiposAgrupados[nombreGrupo].map(equipo => (
                  <div 
                    key={equipo.id} 
                    className='flex-none w-80 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200'
                  >
                    {/* Imagen del equipo */}
                    <div className='bg-blue-50 h-48 flex items-center justify-center overflow-hidden'>
                      <img 
                        src={obtenerImagenEquipo(equipo.field_1)}
                        alt={equipo.field_1 || 'Equipo'}
                        className={`w-full h-full ${obtenerEstiloImagen(equipo.field_1)}`}
                      />
                    </div>

                    {/* Contenido de la card */}
                    <div className='p-5'>
                      <h3 className='text-xl font-bold text-gray-800 mb-3 truncate'>{equipo.field_1 || 'Sin nombre'}</h3>
                      
                      <div className='space-y-2 text-sm'>
                        <div className='flex'>
                          <span className='font-semibold text-gray-700 w-28'>Código:</span>
                          <span className='text-gray-600'>{equipo.code}</span>
                        </div>
                        
                        <div className='flex'>
                          <span className='font-semibold text-gray-700 w-28'>Descripción:</span>
                          <span className='text-gray-600 line-clamp-2'>{equipo.description}</span>
                        </div>

                        <div className='flex'>
                          <span className='font-semibold text-gray-700 w-28'>Grupo:</span>
                          <span className='text-gray-600'>{equipo.groups_1_description}</span>
                        </div>

                        <div className='flex items-center pt-2 border-t border-gray-200 mt-3'>
                          <span className='font-semibold text-gray-700 w-28'>Fuera de servicio:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            equipo.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {equipo.available ? 'No' : 'Si'}
                          </span>
                        </div>

                        <div className='flex items-center'>
                          <span className='font-semibold text-gray-700 w-28'>Activo:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            equipo.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {equipo.active ? 'Si' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FracttalProcesos;