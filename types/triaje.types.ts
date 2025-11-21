import { PrioridadTriaje } from "./Enums";
import { Enfermero } from "./usuarios.types";

export interface Nivel {
  prioridad: PrioridadTriaje;
  color: string;
  tiempoMaximo: number;
}


export interface Triaje {
  nivel: Nivel;
  enfermero?: Enfermero;
  creadoEn: string;
  motivo: string;
  temperatura: number;
  frecuenciaCardiaca: number;
  tensionArterial: number;
  saturacionOxigeno: number;
  observaciones: string;
}
