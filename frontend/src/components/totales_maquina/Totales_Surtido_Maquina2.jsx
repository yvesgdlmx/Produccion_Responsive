import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from '../others/Heading';
import clienteAxios from '../../../config/clienteAxios';
import Graficas from '../others/charts/Graficas';
import TablaSurtidoMaquina from '../others/tables/TablaSurtidoMaquina';
import FiltrosMaquina from '../others/html_personalizado/FiltrosMaquina';
// Ya no se realiza el registro de ChartJS aquí, éste se hace globalmente en chartConfig.js
const Totales_Surtido_Maquina2 = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [hourColumns, setHourColumns] = useState([]);
  const fixedColumns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Total acumulado', accessor: 'totalAcumulado' },
    { header: 'Meta por hora', accessor: 'metaPorHora' },
    { header: 'Meta acumulada', accessor: 'metaAcumulada' },
  ];
  const allColumns = [...fixedColumns, ...hourColumns];
  const filterOptions = allColumns.map(col => ({
    value: col.accessor,
    label: col.header,
  }));
  const [selectedFilterField, setSelectedFilterField] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [selectedArea, setSelectedArea] = useState({
    value: 'surtido',
    label: 'Surtido',
  });
  const areaOptions = [
    { value: 'surtido', label: 'Surtido' },
    { value: 'totales_tallado_maquina', label: 'Bloqueo de tallado' },
    { value: 'gneneradores', label: 'Generadores' },
    { value: 'pulido', label: 'Pulido' },
    { value: 'engraver', label: 'Engraver' },
    { value: 'ar', label: 'Ventas' },
  ];
  const customStyles = {
    control: provided => ({
      ...provided,
      borderColor: '#D1D5DB',
      boxShadow: 'none',
      '&:hover': { borderColor: '#9CA3AF' },
      height: '40px',
      minHeight: '40px',
    }),
    valueContainer: provided => ({
      ...provided,
      height: '40px',
      padding: '0 6px',
    }),
    indicatorsContainer: provided => ({
      ...provided,
      height: '40px',
    }),
    menu: provided => ({
      ...provided,
      zIndex: 9999,
    }),
  };
  const addOneHour = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const nextHour = (hours + 1) % 24;
    return String(nextHour).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  };
  const extractBaseName = (name) => {
    const base = name.split('-')[0].trim();
    console.log("Nombre extraído:", base);
    return base;
  };
  const [metasMapping, setMetasMapping] = useState({});
  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const response = await clienteAxios.get("metas/metas-manuales");
        const registrosMetas = response.data.registros || [];
        const mapping = {};
        registrosMetas.forEach(reg => {
          mapping[reg.name] = reg.meta;
        });
        setMetasMapping(mapping);
      } catch (error) {
        console.error("Error al obtener las metas:", error);
      }
    };
    fetchMetas();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clienteAxios.get("/manual/manual/actualdia");
        const registros = response.data.registros || [];
        console.log('Registros desde API:', registros);
        const now = new Date();
        const currentDateStr = now.toISOString().split('T')[0];
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayDateStr = yesterday.toISOString().split('T')[0];
        const registrosFiltrados = registros.filter(reg => {
          if (reg.fecha === currentDateStr) return true;
          if (reg.fecha === yesterdayDateStr && reg.hour.slice(0, 5) >= "22:00") return true;
          return false;
        });
        console.log("Registros filtrados por fecha y hora:", registrosFiltrados);
        const hourSet = new Set();
        registrosFiltrados.forEach(reg => {
          hourSet.add(reg.hour.slice(0, 5));
        });
        const allHours = Array.from(hourSet);
        const specialHoursOrder = ["22:00", "23:00", "00:00"];
        const specialHours = allHours.filter(hour => specialHoursOrder.includes(hour));
        const normalHours = allHours.filter(hour => !specialHoursOrder.includes(hour));
        normalHours.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
        const sortedSpecialHours = specialHours.sort(
          (a, b) => specialHoursOrder.indexOf(a) - specialHoursOrder.indexOf(b)
        );
        const uniqueHours = [...normalHours, ...sortedSpecialHours];
        console.log("Horas únicas (orden modificada):", uniqueHours);
        const generatedHourColumns = uniqueHours.map(h => ({
          header: `${h} - ${addOneHour(h)}`,
          accessor: `hour_${h}`,
        }));
        setHourColumns(generatedHourColumns);
        const agrupados = {};
        registrosFiltrados.forEach(reg => {
          const baseName = extractBaseName(reg.name);
          if (!agrupados[baseName]) {
            agrupados[baseName] = { nombre: baseName, totalAcumulado: 0 };
          }
          agrupados[baseName].totalAcumulado += Number(reg.hits);
          const key = `hour_${reg.hour.slice(0, 5)}`;
          agrupados[baseName][key] = (agrupados[baseName][key] || 0) + Number(reg.hits);
        });
        console.log("Registros agrupados:", agrupados);
        const allowedNames = ["19 LENS LOG", "20 LENS LOG"];
        const filtrados = Object.values(agrupados).filter(reg =>
          allowedNames.includes(reg.nombre)
        );
        console.log("Registros filtrados por nombre permitidos:", filtrados);
        setTableData(filtrados);
      } catch (error) {
        console.error("Error al consultar la API:", error);
      }
    };
    fetchData();
  }, []);
  const horasTranscurridas = useMemo(() => {
    const now = new Date();
    let shiftStart = new Date(now);
    if (now.getHours() < 22) {
      shiftStart.setDate(now.getDate() - 1);
    }
    shiftStart.setHours(22, 0, 0, 0);
    const diffMs = now - shiftStart;
    return Math.floor(diffMs / (1000 * 60 * 60));
  }, []);
  const filteredData = useMemo(() => {
    if (!selectedFilterField || filterValue.trim() === '') return tableData;
    return tableData.filter(row => {
      const cellVal = row[selectedFilterField.value];
      return cellVal && cellVal.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  }, [tableData, selectedFilterField, filterValue]);
  const finalFilteredData = useMemo(() => {
    return filteredData.map(row => {
      const metaPorHora = metasMapping[row.nombre] || '';
      const metaAcumulada = metaPorHora !== '' ? Number(metaPorHora) * horasTranscurridas : '';
      return {
        ...row,
        metaPorHora,
        metaAcumulada,
      };
    });
  }, [filteredData, metasMapping, horasTranscurridas]);
  const columns = [...fixedColumns, ...hourColumns];
  const totalsRow = useMemo(() => {
    return columns.reduce((acc, col) => {
      if (col.accessor === 'nombre') {
        acc[col.accessor] = 'Totales';
      } else {
        acc[col.accessor] = finalFilteredData.reduce((sum, row) => {
          const num = Number(row[col.accessor] || 0);
          return sum + num;
        }, 0);
      }
      return acc;
    }, {});
  }, [columns, finalFilteredData]);
  const handleAreaChange = (selected) => {
    setSelectedArea(selected);
    navigate(`/${selected.value}`);
  };
  return (
    <div className="p-4">
      <Heading title="Resumen de producción área de surtido" />
      {/* Componento de filtros separado */}
      <FiltrosMaquina
        filterOptions={filterOptions}
        selectedFilterField={selectedFilterField}
        setSelectedFilterField={setSelectedFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        areaOptions={areaOptions}
        selectedArea={selectedArea}
        handleAreaChange={handleAreaChange}
        customStyles={customStyles}
      />
      {/* Tabla usando el componente separado */}
      <TablaSurtidoMaquina
        columns={columns}
        finalFilteredData={finalFilteredData}
        totalsRow={totalsRow}
      />
      {/* Componente de gráficas */}
      <Graficas />
    </div>
  );
};
export default Totales_Surtido_Maquina2;