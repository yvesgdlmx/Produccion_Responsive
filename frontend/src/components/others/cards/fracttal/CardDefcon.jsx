import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const CardDefcon = ({ datos }) => {
  const [expandedCards, setExpandedCards] = useState({});

  const getDefconColor = (defcon) => {
    switch(defcon) {
      case 'DEFCON 1':
        return 'from-red-500 to-red-600';
      case 'DEFCON 2':
        return 'from-orange-500 to-orange-600';
      case 'DEFCON 3':
        return 'from-yellow-500 to-yellow-600';
      case 'DEFCON 4':
        return 'from-blue-500 to-blue-600';
      case 'DEFCON 5':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const toggleExpand = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {datos.map((row, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${getDefconColor(row.defcon)} px-6 py-4 text-white`}>
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold">{row.codigo}</h3>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                {row.defcon}
              </span>
            </div>
            <p className="text-sm text-white/90 mt-1">{row.nombre}</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Producción */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Producción</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Prod/Hora</p>
                  <p className="text-lg font-semibold text-gray-700">{row.prodHora}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Horas Disp.</p>
                  <p className="text-lg font-semibold text-gray-700">{row.horasDisponibles}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Prod Día</p>
                  <p className="text-lg font-semibold text-gray-700">{row.prodDia}</p>
                </div>
              </div>
            </div>

            {/* Capacidad y Objetivo */}
            <div className="border-t pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Capacidad</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">Objetivo</p>
                  <p className="text-lg font-bold text-blue-700">{row.objetivo}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">Capacidad</p>
                  <p className="text-lg font-bold text-green-700">{row.capacidad}</p>
                </div>
              </div>
            </div>

            {/* Criterios DEFCON */}
            <div className="border-t pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Criterios DEFCON</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Impacto</p>
                  <p className="font-bold text-gray-700 text-sm">{row.impacto}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Complejidad</p>
                  <p className="font-bold text-gray-700 text-sm">{row.complejidad}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Redundancia</p>
                  <p className="font-bold text-gray-700 text-sm">{row.redundancia}</p>
                </div>
              </div>
            </div>

            {/* Detalles expandibles */}
            {expandedCards[index] && (
              <div className="border-t pt-4 space-y-4 animate-fadeIn">
                {/* Horas de uso */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Uso y Caídas</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-yellow-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-600">H. Caídas</p>
                      <p className="font-bold text-yellow-700">{row.horasCaidas}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-600">H. C. Teóricas</p>
                      <p className="font-bold text-red-700">{row.horasCaidasTeoricas}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-600">En Uso</p>
                      <p className="font-bold text-green-700">{row.enUso}</p>
                    </div>
                  </div>
                </div>

                {/* Producción por área */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Producción por Área</h4>
                  <div className="bg-indigo-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-indigo-700">{row.prodArea}</p>
                  </div>
                </div>

                {/* Acciones recomendadas */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Acciones Recomendadas</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{row.acciones}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón expandir */}
            <button
              onClick={() => toggleExpand(index)}
              className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 
                       text-blue-700 font-semibold rounded-lg transition-all duration-200 
                       flex items-center justify-center gap-2 border border-blue-200"
            >
              {expandedCards[index] ? (
                <>
                  <span>Ver menos</span>
                  <ChevronUpIcon className="h-5 w-5" />
                </>
              ) : (
                <>
                  <span>Ver más detalles</span>
                  <ChevronDownIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardDefcon;