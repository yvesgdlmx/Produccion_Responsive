import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../config/clienteAxios';
import FracttalProcesosCard from '../../components/others/cards/FracttalProcesosCard';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
// Se definen los grupos permitidos
const gruposPermitidos = [
  'Biseladora',
  'Bloqueadora de biselado',
  'Bloqueadora de tallado',
  'Desbloqueadora',
  'Engraver',
  'Generador',
  'Pulidoras'
];
const Prueba = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = 'https://one.fracttal.com/api/items?available=false';
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
          }
        };
        // Axios parsea la respuesta a JSON por defecto
        const respuesta = await clienteAxios.get(endpoint, options);
        console.log('Datos obtenidos de la API:', respuesta.data);
        // Se filtran los registros que:
        // 1. Tienen uno de los grupos permitidos en groups_1_description
        // 2. Tienen active como true
        const registrosFiltrados = respuesta.data.data.filter(item =>
          gruposPermitidos.includes(item.groups_1_description) && item.active === true
        );
        console.log('Registros filtrados:', registrosFiltrados);
        setItems(registrosFiltrados);
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Fracttal Integration</h1>
      {/* Grid de 3 columnas */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {gruposPermitidos.map(grupo => {
          // Se filtran los items del grupo actual
          const itemsPorGrupo = items.filter(item => item.groups_1_description === grupo);
          return (
            <FracttalProcesosCard
              key={grupo}
              title={grupo}
              linkPath={`/ruta/${grupo.toLowerCase()}`} // Ajusta la ruta según necesites
              inactivas={itemsPorGrupo.length}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Prueba;