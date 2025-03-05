import React from 'react';

const CardRepoFacturacion = ({ registro, headerTitle, fields }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md mb-4">
      {headerTitle && (
        <div className="bg-blue-600 text-white p-4">
          <div className="font-semibold text-lg text-center">{headerTitle}</div>
        </div>
      )}
      <div className="p-4 space-y-2">
        {fields.map(({ label, accessor }) => (
          <div key={accessor} className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">{label}:</span>
            <span className="font-bold text-gray-500">{registro[accessor]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CardRepoFacturacion;