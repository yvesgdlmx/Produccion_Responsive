import moment from "moment-timezone";

export const fixedHoras = [
  "20:30 - 21:30",
  "19:30 - 20:30",
  "18:30 - 19:30",
  "17:30 - 18:30",
  "16:30 - 17:30",
  "15:30 - 16:30",
  "14:30 - 15:30",
  "13:30 - 14:30",
  "12:30 - 13:30",
  "11:30 - 12:30",
  "10:30 - 11:30",
  "09:30 - 10:30",
  "08:30 - 09:30",
  "07:30 - 08:30",
  "06:30 - 07:30",
  "05:00 - 06:00",
  "04:00 - 05:00",
  "03:00 - 04:00",
  "01:00 - 02:00",
  "00:00 - 01:00",
  "23:00 - 00:00",
  "22:00 - 23:00",
];

const horasDeCierre = new Set(fixedHoras.map((intervalo) => intervalo.split(" - ")[1]));

export function hitsEnIntervalo(registros, inicioIntervalo, finIntervalo) {
  const inicio = moment(inicioIntervalo, "HH:mm");
  const fin = moment(finIntervalo, "HH:mm");
  const cruzaMedianoche = inicio.isAfter(fin);
  // Si otro bloque cierra a la hora de inicio, ese bloque recibe el registro del límite.
  const incluirInicio = !horasDeCierre.has(inicioIntervalo);

  return registros.reduce((total, registro) => {
    const hora = moment(registro.hour, "HH:mm:ss");
    const desdeInicio = hora.isAfter(inicio) || (incluirInicio && hora.isSame(inicio));
    const hastaFin = hora.isSameOrBefore(fin);
    const dentro = cruzaMedianoche ? desdeInicio || hastaFin : desdeInicio && hastaFin;
    return dentro ? total + parseInt(registro.hits || 0, 10) : total;
  }, 0);
}
