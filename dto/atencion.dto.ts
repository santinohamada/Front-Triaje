import { PrioridadTriaje } from "@/types/Enums";
import { Ingreso } from "@/types/paciente.types";

export interface Atencion {
  id: number;
  fecha: string;
  paciente: {
    cuil: string;
    nombre: string;
  };
  medico: {
    matricula: string;
    nombre: string;
  };
  diagnostico: string;
}

export type ObtenerTodasAtencionesResponse = Atencion[];

export interface RegistroAtencionDto {
  ingresoId: string;
  diagnosticoPresuntivo: string;
  procedimientoRealizado: string;
  observaciones: string;
}

export interface ColaAtencionItem {
  id: number;
  fechaIngreso: string;
  paciente: {
    cuil: string;
    nombre: string;
  };
  nivelEmergencia: {
    prioridad: string;
    color: string;
    tiempoMaximo: number;
  };
  estado: string;
  informe: string;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria?: number;
  tensionArterial: string;
  temperatura: number;
}

export type ColaAtencionResponse = ColaAtencionItem[];
export interface ReclamarSiguienteResponse {
  id: string;
  fechaIngreso: string;
  informe: string;
  nivelEmergencia:string;
  color: string;
  tiempoMaximoMinutos: 5;
  temperatura: 38;
  frecuenciaCardiaca: 1;
  frecuenciaRespiratoria: 1;
  tensionArterial: string;
  pacienteCuil:string;
  pacienteNombre: string;
  enfermeroMatricula: string;
  enfermeroNombre: string;
}
export interface RegistrarAtencionResponse {
  message: string;
}
export interface RegistroIngresoRequest {
  cuilPaciente: string;
  nombrePaciente: string;
  apellidoPaciente: string;
  emailPaciente: string;
  calleDomicilio: string;
  numeroDomicilio: number;
  localidadDomicilio: string;
  nombreObraSocial?: string;
  numeroAfiliado?: string;
  informe: string;
  nivelEmergencia: PrioridadTriaje;
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  tensionSistolica: number;
  tensionDiastolica: number;
}

export interface ObtenerPacienteResponse {
  cuil: string;
  nombre: string;
  apellido: string;
  email: string;
  domicilio: {
    calle: string;
    numero: number;
    localidad: string;
    provincia: string;
    pais: string;
  };
  afiliado?: {
    nombreObraSocial: string;
    numeroAfiliado: string;
  };
}
export interface ResultadoIngreso {
  esExitoso: boolean;
  mensajeError?: string;
  mensaje?: string;
  ingreso?: Ingreso;
}
export interface ValidacionResultado {
  esValido: boolean;
  mensajeError?: string;
}
export interface LoginResponse {
  esExitoso: boolean;
  token?: string;
  rol?: "Enfermero" | "Medico";
  mensaje?: string;
  email: string;
}

export interface RegisterResponse {
  esExitoso: boolean;
  mensaje: string;
  errores?: string[];
}

export interface WhoAmIResponse {
  message: string;
}
export interface IngresoResponse {
  message: string;
  ingreso: {
    id: number;
    fechaIngreso: string;
    paciente: {
      cuil: string;
      nombre: string;
    };
    nivelEmergencia: {
      prioridad: string;
      color: string;
      tiempoMaximo: number;
    };
    estado: string;
    enfermero: {
      matricula: string;
      nombre: string;
    };
  };
}
