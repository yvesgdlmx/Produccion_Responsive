
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