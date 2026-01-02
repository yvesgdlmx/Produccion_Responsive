import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../../config/clienteAxios';
import { ordenarEquipos } from '../../src/helpers/fracttal/Funciones'

const FracttalContext = createContext();

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

const FracttalProvider = ({ children }) => {
  const [equipos, setEquipos] = useState([]);
  const [equiposAgrupados, setEquiposAgrupados] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const endpoint = 'https://one.fracttal.com/api/items?item_type=2';
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
          }
        };
        
        const respuesta = await clienteAxios.get(endpoint, options);

        // Filtro de equipos
        const filtrados = respuesta.data.data.filter(item => {
          const grupo = item.groups_1_description?.toLowerCase() || '';
          return grupo.startsWith('bloqueadora de tallado') ||
                  grupo.startsWith('generador') ||
                  grupo.startsWith('engraver') ||
                  grupo.startsWith('biseladora') ||
                  grupo.startsWith('pulidora');
        });

        setEquipos(filtrados);

        // Agrupar equipos por groups_1_description
        const agrupados = filtrados.reduce((grupos, equipo) => {
          const nombreGrupo = equipo.groups_1_description || 'Sin grupo';
          if (!grupos[nombreGrupo]) {
            grupos[nombreGrupo] = [];
          }
          grupos[nombreGrupo].push(equipo);
          return grupos;
        }, {});

        // Ordenar cada grupo con la función de helpers
        Object.keys(agrupados).forEach(nombreGrupo => {
          agrupados[nombreGrupo] = ordenarEquipos(agrupados[nombreGrupo], nombreGrupo);
        });

        setEquiposAgrupados(agrupados);
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  return (
    <FracttalContext.Provider value={{
      equipos,
      equiposAgrupados,
      loading,
      error
    }}>
      {children}
    </FracttalContext.Provider>
  );
};

export { FracttalProvider };
export default FracttalContext;