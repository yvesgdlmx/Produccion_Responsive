import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
const CardTotalesRepoFacturacion = ({
  totalNvi,
  totalDineroTerminado,
  totalDineroTallado,
  totalDineroNviUv,
  totalDineroNviHc,
  totalDineroNviAr,
  totalHoya,
  totalDineroTalladoHoya,
  totalDineroArStandard,
  totalDineroArPremium,
  totalInk,
  totalDineroTalladoInk,
  totalDineroHcInk,
  totalDineroArInk,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {/* Card NVI */}
      <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center mb-6">
          <FaMoneyBillWave className="text-green-700 mr-2" size={28} />
          <h3 className="text-2xl font-bold text-gray-800">NVI</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="space-y-3 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Terminados:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroTerminado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tallados:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroTallado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NVI UV:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroNviUv)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NVI HC:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroNviHc)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NVI AR:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroNviAr)}</span>
            </div>
          </div>
          <div className="pt-4 text-center">
            <p className="text-3xl text-green-700">{formatCurrency(totalNvi)}</p>
            <span className="text-sm text-gray-500">Total NVI</span>
          </div>
        </div>
      </div>
      {/* Card HOYA */}
      <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center mb-6">
          <FaMoneyBillWave className="text-green-700 mr-2" size={28} />
          <h3 className="text-2xl font-bold text-gray-800">HOYA</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="space-y-3 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tallados:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroTalladoHoya)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AR Standard:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroArStandard)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AR Premium:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroArPremium)}</span>
            </div>
          </div>
          <div className="pt-4 text-center">
            <p className="text-3xl text-green-700">{formatCurrency(totalHoya)}</p>
            <span className="text-sm text-gray-500">Total HOYA</span>
          </div>
        </div>
      </div>
      {/* Card INK */}
      <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-center mb-6">
          <FaMoneyBillWave className="text-green-700 mr-2" size={28} />
          <h3 className="text-2xl font-bold text-gray-800">INK</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="space-y-3 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tallados:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroTalladoInk)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">HC:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroHcInk)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AR:</span>
              <span className="font-semibold text-green-700">{formatCurrency(totalDineroArInk)}</span>
            </div>
          </div>
          <div className="pt-4 text-center">
            <p className="text-3xl text-green-700">{formatCurrency(totalInk)}</p>
            <span className="text-sm text-gray-500">Total INK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardTotalesRepoFacturacion;