export enum Rol {
  Enfermero = "Enfermero",
  Medico = "Medico",
}

export enum PrioridadTriaje {
  Critico = 1,
  Emergencia = 2,
  Urgencia = 3,
  UrgenciaMenor = 4,
  SinUrgencia = 5,
}

export enum EstadoIngreso {
  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
  FINALIZADO = "FINALIZADO",
}

export interface Usuario {
  id: string
  username: string
  rol: Rol
  nombreCompleto: string
  matricula?: string
}

export interface Paciente {
  id: string
  dni: string
  nombreCompleto: string
  numeroAfiliado: string
  telefono: string
  fechaNacimiento: string
}

export interface Ingreso {
  id: string
  fechaIngreso: string
  informe: string
  prioridad: PrioridadTriaje
  estado: EstadoIngreso
  temperatura?: number
  frecuenciaCardiaca: number
  frecuenciaRespiratoria: number
  tensionArterial: string
  paciente: Paciente
  enfermeroId: string
  medicoId?: string
  fechaCreacion: string
  tiempoEspera?: number
  informeMedico?: string
  fechaFinalizacion?: string
}
