import { PrioridadTriaje } from "@/types/Enums";

export function timeAgo(timestamp: string) {
  const fecha = new Date(timestamp);
  const ahora = new Date();

  const diffMs = ahora.getTime() - fecha.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec} s`;
  if (diffMin < 60) return `${diffMin} m`;
  if (diffHr < 24) return `${diffHr} h`;
  return `${diffDay} d`;
}

export const formatearTiempo = (minutos: number) => {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}m`;
};

// Definimos los estilos una sola vez para evitar duplicidad
const estilosBase = {
  critico: {
    label: "Crítico",
    color: "bg-red-600 text-white hover:bg-red-700",
  },
  emergencia: {
    label: "Emergencia",
    color: "bg-orange-600 text-white hover:bg-orange-700",
  },
  urgencia: {
    label: "Urgencia",
    color: "bg-amber-600 text-white hover:bg-amber-700",
  },
  urgenciaMenor: {
    label: "Urgencia Menor",
    color: "bg-lime-600 text-white hover:bg-lime-700",
  },
  sinUrgencia: {
    label: "Sin Urgencia",
    color: "bg-sky-600 text-white hover:bg-sky-700",
  },
};

// Exportamos un config que acepta TANTO el número del Enum COMO el string del Backend
export const prioridadConfig: Record<
  string | number,
  { label: string; color: string }
> = {

  [PrioridadTriaje.Critico]: estilosBase.critico,
  [PrioridadTriaje.Emergencia]: estilosBase.emergencia,
  [PrioridadTriaje.Urgencia]: estilosBase.urgencia,
  [PrioridadTriaje.UrgenciaMenor]: estilosBase.urgenciaMenor,
  [PrioridadTriaje.SinUrgencia]: estilosBase.sinUrgencia,

  "Critico": estilosBase.critico,
  "Emergencia": estilosBase.emergencia,
  "Urgencia": estilosBase.urgencia,
  "UrgenciaMenor": estilosBase.urgenciaMenor,
  "SinUrgencia": estilosBase.sinUrgencia,
};