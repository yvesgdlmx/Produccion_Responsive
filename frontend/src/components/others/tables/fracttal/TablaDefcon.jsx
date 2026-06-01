import React, { useRef, useEffect, useState } from "react";

const TablaDefcon = ({ datos }) => {
  const containerRef = useRef();
  const tableRef = useRef();
  const stickyRef = useRef();
  const [colWidths, setColWidths] = useState([]);

  // Tooltip logic
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  const handleMouseEnter = (e, nombre) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: nombre,
      x: e.clientX,
      y: rect.bottom,
    });
  };

  const handleMouseMove = (e) => {
    if (tooltip.visible) {
      setTooltip((prev) => ({
        ...prev,
        x: e.clientX,
      }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      text: "",
      x: 0,
      y: 0,
    });
  };

  useEffect(() => {
    if (tableRef.current) {
      const ths = tableRef.current.querySelectorAll("thead th");
      setColWidths(Array.from(ths).map((th) => th.offsetWidth));
    }
  }, [datos.length]);

  useEffect(() => {
    const handleResize = () => {
      if (tableRef.current) {
        const ths = tableRef.current.querySelectorAll("thead th");
        setColWidths(Array.from(ths).map((th) => th.offsetWidth));
      }
      syncStickyHeaderPosition();
    };

    const handleScroll = () => {
      syncStickyHeaderPosition();
      checkStickyVisibility();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", syncStickyHeaderPosition);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", syncStickyHeaderPosition);
      }
    };
  }, []);

  function syncStickyHeaderPosition() {
    if (!tableRef.current || !stickyRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    stickyRef.current.style.left = `${containerRect.left}px`;
    stickyRef.current.style.width = `${containerRect.width}px`;

    const scrollLeft = containerRef.current.scrollLeft;
    const stickyTable = stickyRef.current.querySelector("table");
    if (stickyTable) {
      stickyTable.style.transform = `translateX(-${scrollLeft}px)`;
      stickyTable.style.width = `${tableRef.current.offsetWidth}px`;
    }
  }

  function checkStickyVisibility() {
    if (!tableRef.current || !stickyRef.current || !containerRef.current) return;

    const tableRect = tableRef.current.getBoundingClientRect();

    if (tableRect.top < 110 && tableRect.bottom > 110) {
      stickyRef.current.style.display = "block";
      syncStickyHeaderPosition();
    } else {
      stickyRef.current.style.display = "none";
    }
  }

  useEffect(() => {
    syncStickyHeaderPosition();
  }, [colWidths]);

  useEffect(() => {
    window.addEventListener("scroll", checkStickyVisibility);
    return () => window.removeEventListener("scroll", checkStickyVisibility);
  }, []);

  return (
    <>
      {/* Tooltip flotante */}
      {tooltip.visible && (
        <div
          className="fixed text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg pointer-events-none z-50 backdrop-blur-sm border border-white/20"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 5}px`,
            backgroundColor: 'rgba(31, 41, 55, 0.40)',
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div ref={containerRef} className="overflow-x-auto overflow-y-visible relative">
        {/* Sticky header */}
        <div
          ref={stickyRef}
          style={{
            position: "fixed",
            top: "107px",
            zIndex: 50,
            display: "none",
            background: "#3b82f6",
            overflow: "hidden",
          }}
        >
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th style={{ width: colWidths[0] }} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Código</th>
                <th style={{ width: colWidths[1] }} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Nombre</th>
                <th style={{ width: colWidths[2] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Prod/Hora</th>
                <th style={{ width: colWidths[3] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Horas disp.</th>
                <th style={{ width: colWidths[4] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Prod día</th>
                <th style={{ width: colWidths[5] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Horas caídas</th>
                <th style={{ width: colWidths[6] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Horas caídas teóricas</th>
                <th style={{ width: colWidths[7] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">En uso</th>
                <th style={{ width: colWidths[8] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Prod x área</th>
                <th style={{ width: colWidths[9] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Objetivo</th>
                <th style={{ width: colWidths[10] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Capacidad</th>
                <th style={{ width: colWidths[11] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Impacto</th>
                <th style={{ width: colWidths[12] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Complejidad</th>
                <th style={{ width: colWidths[13] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Redundancia</th>
                <th style={{ width: colWidths[14] }} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Nivel DEFCON</th>
                <th style={{ width: colWidths[15] }} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Tabla principal */}
        <table ref={tableRef} className="min-w-full border-collapse">
          <thead className="bg-blue-500 border-b">
            <tr className="text-xs font-semibold text-white uppercase tracking-wide">
              <th className="px-4 py-3 text-left whitespace-nowrap">Código</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Nombre</th>
              <th className="px-4 py-3 whitespace-nowrap">Prod/Hora</th>
              <th className="px-4 py-3 whitespace-nowrap">Horas disp.</th>
              <th className="px-4 py-3 whitespace-nowrap">Prod día</th>
              <th className="px-4 py-3 whitespace-nowrap">Horas caídas</th>
              <th className="px-4 py-3 whitespace-nowrap">Horas caídas teóricas</th>
              <th className="px-4 py-3 whitespace-nowrap">En uso</th>
              <th className="px-4 py-3 whitespace-nowrap">Prod x área</th>
              <th className="px-4 py-3 whitespace-nowrap">Objetivo</th>
              <th className="px-4 py-3 whitespace-nowrap">Capacidad</th>
              <th className="px-4 py-3 whitespace-nowrap">Impacto</th>
              <th className="px-4 py-3 whitespace-nowrap">Complejidad</th>
              <th className="px-4 py-3 whitespace-nowrap">Redundancia</th>
              <th className="px-4 py-3 whitespace-nowrap">Nivel DEFCON</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {datos.map((row, index) => (
              <tr
                key={index}
                className={`text-sm text-gray-700 hover:bg-gray-200 transition ${
                  index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                }`}
                onMouseEnter={(e) => handleMouseEnter(e, row.nombre)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <td className="px-4 py-3 whitespace-nowrap">{row.codigo}</td>
                <td className="px-4 py-3 whitespace-nowrap">{row.nombre}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.prodHora}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.horasDisponibles}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.prodDia}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.horasCaidas}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.horasCaidasTeoricas}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.enUso}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.prodArea}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.objetivo}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.capacidad}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.impacto}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.complejidad}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{row.redundancia}</td>
                <td className="px-4 py-3 text-center font-semibold whitespace-nowrap">{row.defcon}</td>
                <td className="px-4 py-3 whitespace-nowrap">{row.acciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablaDefcon;