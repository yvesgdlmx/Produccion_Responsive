// Funcion para obetner la imagen según el nombre del equipo
 export const obtenerImagenEquipo = (nombreEquipo) => {
    const nombre = nombreEquipo?.toLowerCase() || '';
    if(nombre.includes('hse')) {
      return '/img/biseladoras/HSE.png';
    } else if (nombre.includes('doubler') || nombre.includes('racer') || nombre.includes('bisphera')) {
      return '/img/biseladoras/RACER.png'
    } else if (nombre.includes('biseladora')) {
      return '/img/biseladoras/biseladora.png';
    } else if (nombre.includes('bloqueadora de tallado 1') || 
                nombre.includes('bloqueadora de tallado 2') || 
                nombre.includes('bloqueadora de tallado 3') ||
                nombre.includes('bloqueadora de tallado 4') ||
                nombre.includes('bloqueadora de tallado 5') ||
                nombre.includes('bloqueadora de tallado 6')
              ) {
      return '/img/tallado/tallado_SATIS.png';
    } else if (nombre.includes('bloqueadora de tallado 7')) {
      return '/img/tallado/tallado_OPTO TECH.png';
    } else if (nombre.includes('engraver 1') || nombre.includes('engraver 5') || nombre.includes('engraver 4')) {
      return '/img/engraver/SATIS_LENSMARK.png'
    } else if (nombre.includes('engraver 2')) {
      return '/img/engraver/SCHNEIDER.png'
    } else if (nombre.includes('engraver 3')) {
      return '/img/engraver/OPTOTECH_OTL.png'
    } else if (nombre.includes('generador 3 l/a') || nombre.includes('generador 4 l/a') || nombre.includes('generador 2 l/a') || nombre.includes('generador 1 l/a')) {
      return '/img/generadores/GENERADOR_1_LA.png'
    } else if (nombre.includes('generador 5 l/m') || nombre.includes('generador 4 l/m') || nombre.includes('generador 3 l/m') || nombre.includes('generador 2 l/m') || nombre.includes('generador 1 l/m')) {
      return '/img/generadores/GENERADOR_1_LM.png'
    } else if (nombre.includes('generador 6 l/m')) {
      return '/img/generadores/GENERADOR_6_LM.png'
    } else if (nombre.includes('multiflex')) {
      return '/img/pulidoras/pulidora_multiflex.png'
    } else if (nombre.includes('dúo') || nombre.includes('duo')) {
      return '/img/pulidoras/pulidora_duo.png'
    } else if (nombre.includes('toro')) {
      return '/img/pulidoras/pulidora_toro.webp'
    }
  }

export const obtenerEstiloImagen = (nombreEquipo) => {
    const nombre = nombreEquipo?.toLowerCase() || '';
    if(nombre.includes('hse')) {
      return 'object-contain scale-95';
    } else if (nombre.includes('doubler') || nombre.includes('racer') || nombre.includes('bisphera')) {
      return 'object-contain p-2';
    } else if (nombre.includes('biseladora')) {
      return 'object-contain scale-75'
    } else if (nombre.includes('bloqueadora de tallado 1') || 
                nombre.includes('bloqueadora de tallado 2') || 
                nombre.includes('bloqueadora de tallado 3') ||
                nombre.includes('bloqueadora de tallado 4') ||
                nombre.includes('bloqueadora de tallado 5') ||
                nombre.includes('bloqueadora de tallado 6')
              ) {
      return 'object-contain';
    } else if (nombre.includes('bloqueadora de tallado 7')) {
      return 'object-contain scale-90 mb-8';
    } else if (nombre.includes('engraver 1') || nombre.includes('engraver 5') || nombre.includes('engraver 4')) {
      return 'object-contain scale-110';
    } else if (nombre.includes('engraver 2')) {
      return 'object-contain scale-100';
    } else if (nombre.includes('engraver 3')) {
      return 'object-contain scale-90';
    } else if (nombre.includes('generador 3 l/a') || nombre.includes('generador 4 l/a') || nombre.includes('generador 2 l/a') || nombre.includes('generador 1 l/a')) {
      return 'object-contain scale-90 p-2';
    } else if (nombre.includes('generador 5 l/m') || nombre.includes('generador 4 l/m') || nombre.includes('generador 3 l/m') || nombre.includes('generador 2 l/m') || nombre.includes('generador 1 l/m')) {
      return 'object-contain scale-90 p-2';
    } else if (nombre.includes('generador 6 l/m')) {
      return 'object-contain scale-90';
    } else if (nombre.includes('multiflex')) {
      return 'object-contain scale-90 p-3';
    } else if (nombre.includes('dúo') || nombre.includes('duo')) {
      return 'object-contain scale-90';
    } else if (nombre.includes('toro')) {
      return 'object-contain scale-90 p-4';
    }
  }

   //Funcion para ordenar equipos de manera personalizada
  export const ordenarEquipos = (equipos, nombreGrupo) => {
    const grupo = nombreGrupo.toLowerCase();
    //BISELADO
    if(grupo.includes('biseladora')) {
      return equipos.sort((a, b) => {
        const nombreA = a.field_1?.toLowerCase() || '';
        const nombreB = b.field_1?.toLowerCase() || '';

        // Orden de categorias: Biseladora -> HSE -> Doubler -> Racer -> Bisphera
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

        // Si son diferente categorias, ordenar por categoria
        if (categoriaA !== categoriaB) {
          return categoriaA - categoriaB;
        }

        // Si son de la misma categoria, ordenar por numero
        const extraerNumero = (nombre) => {
          const match = nombre.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        }

        return extraerNumero(nombreA) - extraerNumero(nombreB);
      })
    }
    //Bloqueo de tallado
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
    //Engraver
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
    //Generadores
    if(grupo.includes('generador')) {
      return equipos.sort((a, b) => {
        const nombreA = a.field_1?.toLowerCase() || '';
        const nombreB = b.field_1?.toLowerCase() || '';

        const tipoA = nombreA.includes('l/a') ? 1 : 2;
        const tipoB = nombreB.includes('l/a') ? 1 : 2;

        if (tipoA !== tipoB) {
          return tipoA - tipoB;
        }

        const extraerNumero = (nombre) => {
          const match = nombre.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        }

        return extraerNumero(nombreA) - extraerNumero(nombreB)
      })
    }
    //Pulidoras
    if(grupo.includes('pulidora')) {
      return equipos.sort((a, b) => {
        const nombreA = a.field_1?.toLowerCase() || '';
        const nombreB = b.field_1?.toLowerCase() || '';

        //Orden: Multiflex L/A -> DOU L/M -> Toro L/M
        const getCategoriasorden = (nombre) => {
          if (nombre.includes('multiflex')) return 1;
          if (nombre.includes('dúo') || nombre.includes('duo')) return 2;
          if (nombre.includes('toro')) return 3;
          return 4;
        }

        const categoriaA = getCategoriasorden(nombreA);
        const categoriaB = getCategoriasorden(nombreB);

        if(categoriaA !== categoriaB) {
          return categoriaA - categoriaB;
        }

        const extraerNumero = (nombre) => {
          const match = nombre.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        }

        const numeroA = extraerNumero(nombreA);
        const numeroB = extraerNumero(nombreB);

        // Si uno tiene numero y otro no, el que no tiene numero va al final
        if (numeroA === 0 && numeroB !== 0) return 1;
        if (numeroA !== 0 && numeroB === 0) return -1;

        return numeroA - numeroB;
      })
    }

    // Para otros grupos, ordenar normalmente por codigo
    return equipos.sort((a, b) => {
      return a.code.localeCompare(b.code, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    })
  }