import React, { useState, useEffect } from "react";
import {
  TableCellsIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import TablaDefcon from "../../components/others/tables/fracttal/TablaDefcon";
import CardDefcon from "../../components/others/cards/fracttal/CardDefcon";
import ModalCapturaDefcon from "../../components/modals/ModalCapturaDefcon";
import Heading from "../../components/others/Heading";
import useFracttal from "../../../hooks/fracttal/useFracttal";

const Defcon = () => {
  const {
    datosDefcon,
    loadingDefcon,
    error,
    actualizarDefcon,
  } = useFracttal();

  const [vistaActual, setVistaActual] = useState("tabla");
  const [esPantallaGrande, setEsPantallaGrande] = useState(window.innerWidth >= 1024);
  const [modalOpen, setModalOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const esGrande = window.innerWidth >= 1024;
      setEsPantallaGrande(esGrande);
      if (!esGrande) {
        setVistaActual("cards");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAbrirModal = (equipo) => {
    setEquipoSeleccionado(equipo);
    setModalOpen(true);
  };

  const handleGuardarConfig = async () => {
    await actualizarDefcon();
    setModalOpen(false);
    setEquipoSeleccionado(null);
  };

  if (loadingDefcon) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Heading title={"Sistema DEFCON"} />
      </div>

      {/* Barra de controles */}
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">
            {datosDefcon.length}{" "}
            {datosDefcon.length === 1
              ? "equipo registrado"
              : "equipos registrados"}
          </h3>
        </div>

        <div className="flex gap-3">
          {/* Botón crear nueva configuración */}
          <button
            onClick={() => {
              setEquipoSeleccionado(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 
               hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold 
               transition-all duration-200 shadow-lg hover:shadow-xl 
               transform hover:-translate-y-0.5"
          >
            <span>+ Nueva Configuración</span>
          </button>

          {/* Botón cambiar vista - SOLO en pantallas grandes */}
          {esPantallaGrande && (
            <button
              onClick={() =>
                setVistaActual(vistaActual === "tabla" ? "cards" : "tabla")
              }
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 
                 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold 
                 transition-all duration-200 shadow-lg hover:shadow-xl 
                 transform hover:-translate-y-0.5"
            >
              {vistaActual === "tabla" ? (
                <>
                  <RectangleStackIcon className="h-5 w-5" />
                  <span>Vista Cards</span>
                </>
              ) : (
                <>
                  <TableCellsIcon className="h-5 w-5" />
                  <span>Vista Tabla</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Vista condicional: Tabla o Cards */}
      {datosDefcon.length > 0 ? (
        vistaActual === "tabla" ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <TablaDefcon datos={datosDefcon} onEditar={handleAbrirModal} />
          </div>
        ) : (
          <CardDefcon datos={datosDefcon} onEditar={handleAbrirModal} />
        )
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800">No hay equipos disponibles</p>
        </div>
      )}

      {/* Modal */}
      <ModalCapturaDefcon
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEquipoSeleccionado(null);
        }}
        equipos={datosDefcon}
        onSave={handleGuardarConfig}
      />
    </div>
  );
};

export default Defcon;