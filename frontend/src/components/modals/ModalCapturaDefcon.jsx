import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/clienteAxios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ModalCapturaDefcon = ({ isOpen, onClose, equipos, onSave }) => {
  const [formRows, setFormRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && equipos) {
      setFormRows(equipos.map(eq => ({
        codigo: eq.codigo,
        nombre: eq.nombre,
        prodHora: eq.prodHora || 0,
        horasDisponibles: eq.horasDisponibles || 0,
        objetivo: eq.objetivo || 0
      })));
    }
  }, [isOpen, equipos]);

  const handleChange = (idx, field, value) => {
    setFormRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: parseFloat(value) || 0 } : row
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await clienteAxios.put('/defcon/configuracion-defcon/bulk-update', { configuraciones: formRows });
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Captura Masiva DEFCON</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <div className="overflow-x-auto flex-1">
            <div className="max-h-[55vh] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-100 sticky top-0 z-10">
                    <th className="px-2 py-2">Código</th>
                    <th className="px-2 py-2">Nombre</th>
                    <th className="px-2 py-2">Prod/Hora</th>
                    <th className="px-2 py-2">Horas Disp.</th>
                    <th className="px-2 py-2">Objetivo</th>
                  </tr>
                </thead>
                <tbody>
                  {formRows.map((row, idx) => (
                    <tr key={row.codigo} className="border-b">
                      <td className="px-2 py-2">{row.codigo}</td>
                      <td className="px-2 py-2">{row.nombre}</td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={row.prodHora}
                          onChange={e => handleChange(idx, 'prodHora', e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={row.horasDisponibles}
                          onChange={e => handleChange(idx, 'horasDisponibles', e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={row.objetivo}
                          onChange={e => handleChange(idx, 'objetivo', e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCapturaDefcon;