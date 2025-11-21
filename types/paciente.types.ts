import { EstadoIngreso, PrioridadTriaje, Rol } from "./Enums";
import { Enfermero, Medico, Persona } from "./usuarios.types";

export interface ObraSocial {
  id: string;
  nombre: string;
}


export interface Afiliado {
  obraSocial: ObraSocial;
  numeroAfiliado: string;
}
export interface Domicilio {
  id: string;
  calle: string;
  numero: number;
  localidad: string;
  provincia: string;
  pais: string;
}

export interface Ingreso {
  id: string;
  fechaIngreso: string;
  informe: string;
  nivelEmergencia: NivelEmergencia;
  estado: EstadoIngreso;
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  tensionArterial: string;
  paciente: Paciente;
  enfermero: Enfermero;
  fechaCreacion: string;
}

export interface Paciente extends Persona {
  id: string
  domicilio?: Domicilio;
  afiliado?: Afiliado;
}

export interface NivelEmergencia {
  prioridad: PrioridadTriaje;
  color: string;
  tiempoMaximoMinutos: number;
}


export interface Atencion {
  inicio: string;
  fin: string;
  diagnosticoPresuntivo: string;
  procedimientoRealizado: string;
  observaciones: string;
  ingreso: Ingreso;
  medico: Medico;
}

export interface Usuario {
  userName: string;
  password: string;
  rol: Rol;
}
