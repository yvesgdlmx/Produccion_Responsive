import React from 'react';
import Select from 'react-select';
const FiltrosMaquina = ({
  filterOptions,
  selectedFilterField,
  setSelectedFilterField,
  filterValue,
  setFilterValue,
  areaOptions,
  selectedArea,
  handleAreaChange,
  customStyles,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Filtrar por:</span>
        <div className="w-64">
          <Select
            options={filterOptions}
            value={selectedFilterField}
            onChange={setSelectedFilterField}
            placeholder="Selecciona un campo"
            styles={customStyles}
          />
        </div>
        <div className="w-64">
          <input
            type="text"
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            placeholder="Ingresa valor..."
            className="w-full px-4 py-1.5 border border-gray-300 rounded-md focus:ring focus:ring-gray-400 transition duration-150"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Área:</span>
        <div className="w-64">
          <Select
            options={areaOptions}
            value={selectedArea}
            onChange={handleAreaChange}
            placeholder="Elige área"
            styles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};
export default FiltrosMaquina;