import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../../config/clienteAxios';

const FracttalContext = createContext();

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

const ordenPreferido = [
  'generador',
  'bloqueadora de tallado',
  'pulidora',
  'engraver',
  'biseladora'
];

const normalizar = (nombre) => (nombre || '').toLowerCase();

const getOrdenGrupo = (nombreGrupo) => {
  const nombre = normalizar(nombreGrupo);
  const idx = ordenPreferido.findIndex((key) => nombre.includes(key));
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

const ordenarEquipos = (equipos, nombreGrupo) => {
  const grupo = nombreGrupo.toLowerCase();
  if(grupo.includes('biseladora')) {
    return equipos.sort((a, b) => {
      const nombreA = a.field_1?.toLowerCase() || '';
      const nombreB = b.field_1?.toLowerCase() || '';
      const getCategoriaOrden = (nombre) => {
        if (nombre.includes('bisphera')) return 5;
        if (nombre.includes('racer')) return 4;
        if (nombre.includes('doubler')) return 3;
        if (nombre.includes('hse')) return 2;
        if (nombre.includes('biseladora')) return 1;
        return 6;
      }
      const categoriaA = getCategoriaOrden(nombreA);
      const categoriaB = getCategoriaOrden(nombreB);
      if (categoriaA !== categoriaB) return categoriaA - categoriaB;
      const extraerNumero = (nombre) => {
        const match = nombre.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      return extraerNumero(nombreA) - extraerNumero(nombreB);
    })
  }
  if(grupo.includes('bloqueadora de tallado')) {
    return equipos.sort((a, b) => {
      const nombreA = a.field_1?.toLowerCase() || '';
      const nombreB = b.field_1?.toLowerCase() || '';
      const esAutoBloqueadoraA = nombreA.includes('autobloqueadora');
      const esAutoBloqueadoraB = nombreB.includes('autobloqueadora');
      if(esAutoBloqueadoraA !== esAutoBloqueadoraB) {
        return esAutoBloqueadoraA ? 1 : -1;
      }
      const extraerNumero = (nombre) => {
        const match = nombre.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      return extraerNumero(nombreA) - extraerNumero(nombreB);
    })
  }
  if(grupo.includes('engraver')) {
    return equipos.sort((a, b) => {
      const nombreA = a.field_1?.toLowerCase() || '';
      const nombreB = b.field_1?.toLowerCase() || '';
      const extraerNumero = (nombre) => {
        const match = nombre.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      return extraerNumero(nombreA) - extraerNumero(nombreB)
    })
  }
  if(grupo.includes('generador')) {
    return equipos.sort((a, b) => {
      const nombreA = a.field_1?.toLowerCase() || '';
      const nombreB = b.field_1?.toLowerCase() || '';
      const tipoA = nombreA.includes('l/a') ? 1 : 2;
      const tipoB = nombreB.includes('l/a') ? 1 : 2;
      if (tipoA !== tipoB) return tipoA - tipoB;
      const extraerNumero = (nombre) => {
        const match = nombre.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      return extraerNumero(nombreA) - extraerNumero(nombreB)
    })
  }
  if(grupo.includes('pulidora')) {
    return equipos.sort((a, b) => {
      const nombreA = a.field_1?.toLowerCase() || '';
      const nombreB = b.field_1?.toLowerCase() || '';
      const getCategoriasorden = (nombre) => {
        if (nombre.includes('multiflex')) return 1;
        if (nombre.includes('dúo') || nombre.includes('duo')) return 2;
        if (nombre.includes('toro')) return 3;
        return 4;
      }
      const categoriaA = getCategoriasorden(nombreA);
      const categoriaB = getCategoriasorden(nombreB);
      if(categoriaA !== categoriaB) return categoriaA - categoriaB;
      const extraerNumero = (nombre) => {
        const match = nombre.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
      const numeroA = extraerNumero(nombreA);
      const numeroB = extraerNumero(nombreB);
      if (numeroA === 0 && numeroB !== 0) return 1;
      if (numeroA !== 0 && numeroB === 0) return -1;
      return numeroA - numeroB;
    })
  }
  return equipos.sort((a, b) => {
    return a.code.localeCompare(b.code, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
};

const ordenarEquiposPorArea = (equipos) => {
  const grupos = equipos.reduce((acc, equipo) => {
    const nombreGrupo = equipo.groups_1_description || 'Sin grupo';
    if (!acc[nombreGrupo]) acc[nombreGrupo] = [];
    acc[nombreGrupo].push(equipo);
    return acc;
  }, {});
  return Object.keys(grupos)
    .sort((a, b) => {
      const ordenA = getOrdenGrupo(a);
      const ordenB = getOrdenGrupo(b);
      if (ordenA !== ordenB) return ordenA - ordenB;
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    })
    .flatMap((nombreGrupo) => ordenarEquipos([...grupos[nombreGrupo]], nombreGrupo));
};

const obtenerHorasCaidasTeoricas = async (codigo) => {
  try {
    const endpoint = `https://app.fracttal.com/api/work_orders?code_asset=${codigo}`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
      }
    };
    const { data } = await clienteAxios.get(endpoint, options);
    const workOrders = data.data || data;
    if (!Array.isArray(workOrders) || workOrders.length === 0) return 0;
    // Buscar la OT con la creation_date más reciente
    const otReciente = workOrders.reduce((a, b) =>
      new Date(a.creation_date) > new Date(b.creation_date) ? a : b 
    );
    const durationSegundos = otReciente.duration || 0;
    // Convertir a horas enteras
    const durationHoras = Math.floor(durationSegundos / 3600);
    return durationHoras;
  } catch (error) {
    console.error('Error obteniendo horas caídas teóricas:', error);
    return 0;
  }
};

const calcularHorasCaidas = (equipo) => {
  if (equipo.available === false && equipo.initial_date_out_of_service) {
    const fechaCaida = new Date(equipo.initial_date_out_of_service);
    const ahora = new Date();
    const diffMs = ahora - fechaCaida;
    return Math.floor(diffMs / (1000 * 60 * 60)); // Horas completas
  }
  return 0;
};

const mapearEquiposADefcon = async (equipos) => {
  try {
    const { data } = await clienteAxios.get('/defcon/configuracion-defcon');
    const configuraciones = data.data || [];
    const configMap = {};
    configuraciones.forEach(config => {
      configMap[config.nombre] = config;
    });

    // Obtén todas las horas caídas teóricas en paralelo
    const horasCaidasTeoricasArr = await Promise.all(
      equipos.map((equipo) => obtenerHorasCaidasTeoricas(equipo.code))
    );

    return equipos.map((equipo, idx) => {
      const nombre = equipo.field_1 || equipo.description;
      const config = configMap[nombre] || {};
      const prodHora = config.prodHora || 0;
      const horasDisponibles = config.horasDisponibles || 0;
      const prodDia = prodHora * horasDisponibles;
      const horasCaidas = calcularHorasCaidas(equipo);

      return {
        codigo: equipo.code,
        nombre: nombre,
        prodHora: prodHora,
        horasDisponibles: horasDisponibles,
        prodDia: prodDia,
        horasCaidas: horasCaidas,
        horasCaidasTeoricas: horasCaidasTeoricasArr[idx], // Aquí la columna
        enUso: 0,
        prodArea: 0,
        objetivo: config.objetivo || 0,
        capacidad: "0%",
        impacto: "Medio",
        complejidad: "Bajo",
        redundancia: "Nulo",
        defcon: "DEFCON 4",
        acciones: "MP básico + Seguimiento",
        id: equipo.id,
        description: equipo.description,
        priority: equipo.priorities_description,
        group: equipo.groups_1_description,
      };
    });
  } catch (error) {
    console.error('Error al mapear equipos:', error);
    return [];
  }
};

const mapearEquiposADefconOrdenado = async (equipos) => {
  const ordenados = ordenarEquiposPorArea(equipos);
  return await mapearEquiposADefcon(ordenados);
};

const FracttalProvider = ({ children }) => {
  const [equipos, setEquipos] = useState([]);
  const [equiposAgrupados, setEquiposAgrupados] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [datosDefcon, setDatosDefcon] = useState([]);
  const [loadingDefcon, setLoadingDefcon] = useState(false);

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
        const filtrados = respuesta.data.data.filter(item => {
          const grupo = item.groups_1_description?.toLowerCase() || '';
          return grupo.startsWith('bloqueadora de tallado') ||
            grupo.startsWith('generador') ||
            grupo.startsWith('engraver') ||
            grupo.startsWith('biseladora') ||
            grupo.startsWith('pulidora');
        });
        setEquipos(filtrados);
        const agrupados = filtrados.reduce((grupos, equipo) => {
          const nombreGrupo = equipo.groups_1_description || 'Sin grupo';
          if (!grupos[nombreGrupo]) {
            grupos[nombreGrupo] = [];
          }
          grupos[nombreGrupo].push(equipo);
          return grupos;
        }, {});
        Object.keys(agrupados).forEach(nombreGrupo => {
          agrupados[nombreGrupo] = ordenarEquipos(agrupados[nombreGrupo], nombreGrupo);
        });
        setEquiposAgrupados(agrupados);
        setLoadingDefcon(true);
        const defconData = await mapearEquiposADefconOrdenado(filtrados);
        setDatosDefcon(defconData);
        setLoadingDefcon(false);
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
        setError(error.message);
        setLoadingDefcon(false);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
  }, []);

  const actualizarDefcon = async () => {
    setLoadingDefcon(true);
    const defconData = await mapearEquiposADefconOrdenado(equipos);
    setDatosDefcon(defconData);
    setLoadingDefcon(false);
  };

  return (
    <FracttalContext.Provider value={{
      equipos,
      equiposAgrupados,
      loading,
      error,
      datosDefcon,
      loadingDefcon,
      actualizarDefcon,
      ordenarEquipos,
      ordenarEquiposPorArea,
      mapearEquiposADefcon,
      mapearEquiposADefconOrdenado
    }}>
      {children}
    </FracttalContext.Provider>
  );
};

export { FracttalProvider };
export default FracttalContext;