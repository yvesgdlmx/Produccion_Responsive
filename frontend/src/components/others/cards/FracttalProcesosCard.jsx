import React from "react";
import { Link } from "react-router-dom";
import { formatNumber } from "../../../helpers/formatNumber";
import { FaComment } from "react-icons/fa";
const FracttalProcesosCard = ({
  title,
  linkPath,
  inactivas,
  // Si en el futuro recibes datos reales de turnos, pásalos por props.
  // Por el momento definimos algunos valores por defecto.
  turnos = {
    matutino: { hits: 0, meta: 0, comentario: null },
    vespertino: { hits: 0, meta: 0, comentario: null },
    nocturno: { hits: 0, meta: 0, comentario: null }
  },
  // Funciones dummy para el manejo de turnos; en el futuro se implementarán.
  toggleNotaTurno = () => {},
  turnoActivo = "",
  editingTurnoNota = "",
  setEditingTurnoNota = () => {},
  handleGuardarNotaTurno = () => {},
  handleEditarNotaTurno = () => {}
}) => {
  const getClassName = (hits, meta) =>
    hits >= meta ? "text-green-700" : "text-red-700";
  return (
    <div className="bg-white p-4 rounded-xl">
      {/* Link para pantallas grandes */}
      <Link to={linkPath} className="hidden lg:block">
        <div className="bg-teal-500 p-2 mb-2 flex items-center justify-between">
          <h2 className="text-white font-bold uppercase">{title}</h2>
          <img
            src="/img/arrow.png"
            alt="ver"
            width={25}
            style={{ filter: "invert(100%)" }}
          />
        </div>
      </Link>
      {/* Link para pantallas pequeñas */}
      <Link to={linkPath} className="block lg:hidden">
        <div className="bg-blue-500 p-2 mb-2 flex items-center justify-between">
          <h2 className="text-white font-bold uppercase">{title}</h2>
          <img
            src="/img/arrow.png"
            alt="ver"
            width={25}
            style={{ filter: "invert(100%)" }}
          />
        </div>
      </Link>
      <p className="font-light mb-2">Mostrando información del área {title}.</p>
      {/* Sección principal de datos */}
      <div className="flex items-center justify-between py-4 px-2 border-2 mb-4">
        <p className="font-bold text-gray-700 xs:text-sm md:text-md">
          Máquinas fuera:{" "}
          <span className="font-semibold">{inactivas}</span>
        </p>
        <p className="font-bold text-gray-700 xs:text-sm md:text-md">
          Meta: <span className="font-semibold">--</span>
        </p>
      </div>
      {/* Sección de turnos */}
      <div className="flex items-center justify-between py-4 px-2 border-2 relative">
        {Object.keys(turnos).map((turnoKey, index) => {
          const turno = turnos[turnoKey];
          return (
            <div
              key={index}
              className="cursor-pointer relative"
              onClick={() => toggleNotaTurno(turnoKey)}
              title={
                turno && turno.comentario
                  ? turno.comentario
                  : "Haz click para agregar un comentario"
              }
            >
              <p className="font-bold text-gray-700 xs:text-sm md:text-md">
                {turnoKey.charAt(0).toUpperCase() + turnoKey.slice(1)}:
                <span className={getClassName(turno.hits, turno.meta)}>
                  {" "}
                  {formatNumber(turno.hits)}{" "}
                </span>
                / {formatNumber(turno.meta)}
                {turno && turno.comentario && (
                  <FaComment className="inline-block ml-1 mb-1 text-blue-500" />
                )}
              </p>
              {turnoActivo === turnoKey && (
                <div
                  className={`absolute top-[-55px] z-50 ${
                    turnoKey === "vespertino"
                      ? "right-0"
                      : turnoKey === "matutino"
                      ? "left-[33%]"
                      : "left-0"
                  } bg-gray-100 p-4 border rounded shadow-md w-64 h-24 text-xs`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {turno && turno.comentario ? (
                    <p></p>
                  ) : (
                    <p>Agregar un comentario</p>
                  )}
                  <textarea
                    className="w-full h-16 p-1 border mb-2 text-xs"
                    value={editingTurnoNota}
                    onChange={(e) => setEditingTurnoNota(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex justify-end space-x-2">
                    {turno && turno.comentario ? (
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarNotaTurno(turnoKey);
                        }}
                      >
                        Guardar Cambios
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded text-xs hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGuardarNotaTurno(turnoKey);
                        }}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded text-xs hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotaTurno(null);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FracttalProcesosCard;