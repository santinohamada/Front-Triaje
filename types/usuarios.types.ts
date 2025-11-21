import { Atencion } from "../dto/atencion.dto";
import { Ingreso } from "./paciente.types";


export interface Persona {
  cuil: string;
  nombre: string;
  apellido?: string;
  email?: string;
}
export interface Enfermero extends Persona {
  id: string;
  matricula: string;

}
export interface Medico extends Persona {
  matricula: string;
  atenciones: Atencion[];
}