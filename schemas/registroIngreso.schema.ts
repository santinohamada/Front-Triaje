import { z } from "zod";
import { PrioridadTriaje } from "@/types/Enums";

export const registroIngresoSchema = z.object({
  // Historia 2: Registro de paciente
  cuilPaciente: z.string()
    .min(1, "El CUIL del paciente es obligatorio.")
    .min(10, "El CUIL del paciente debe tener al menos 10 dígitos.")
    .max(11, "El CUIL del paciente no puede tener más de 11 dígitos."),
    
  nombrePaciente: z.string()
    .min(1, "El nombre del paciente es obligatorio."),
    
  apellidoPaciente: z.string()
    .min(1, "El apellido del paciente es obligatorio."),
    
  emailPaciente: z.string()
    .min(1, "El email del paciente es obligatorio.")
    .email("El email del paciente no es válido."),

  // Domicilio
  calleDomicilio: z.string()
    .min(1, "La calle del domicilio es obligatoria."),
    
  numeroDomicilio: z.coerce.number()
    .gt(0, "El número del domicilio debe ser mayor que 0."),
    
  localidadDomicilio: z.string()
    .min(1, "La localidad del domicilio es obligatoria."),

  // Lógica de UI para manejo de Obra Social (se valida en superRefine)
  tieneObraSocial: z.boolean().default(false),
  nombreObraSocial: z.string().optional(),
  numeroAfiliado: z.string().optional(),

  // Historia 1: Triaje y Signos Vitales
  informe: z.string()
    .min(1, "El informe es obligatorio."),
    
  prioridad: z.nativeEnum(PrioridadTriaje, {
    errorMap: () => ({ message: "El nivel de emergencia es obligatorio." }),
  }),

  temperatura: z.coerce.number()
    .gt(0, "La temperatura debe ser mayor que 0."),
    
  frecuenciaCardiaca: z.coerce.number()
    .gt(0, "La frecuencia cardíaca debe ser mayor que 0."),
    
  frecuenciaRespiratoria: z.coerce.number()
    .gt(0, "La frecuencia respiratoria debe ser mayor que 0."),
    
  tensionSistolica: z.coerce.number()
    .gt(0, "La tensión sistólica debe ser mayor que 0."),
    
  tensionDiastolica: z.coerce.number()
    .gt(0, "La tensión diastólica debe ser mayor que 0."),

}).superRefine((data, ctx) => {
  // Replica de: VerificarObraSocial
  // "Si se proporciona el nombre, también debe proporcionarse el número, y viceversa."
  const tieneNombre = data.nombreObraSocial && data.nombreObraSocial.length > 0;
  const tieneNumero = data.numeroAfiliado && data.numeroAfiliado.length > 0;

  // Si la lógica de UI (tieneObraSocial) está activa, forzamos la validación,
  // o si el usuario llenó uno de los campos manualmente.
  if (data.tieneObraSocial || tieneNombre || tieneNumero) {
     if (tieneNombre && !tieneNumero) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numeroAfiliado"],
        message: "Si se proporciona el nombre de la obra social, también debe proporcionarse el número de afiliado.",
      });
    }
    if (!tieneNombre && tieneNumero) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nombreObraSocial"],
        message: "Si se proporciona el número de afiliado, también debe proporcionarse el nombre de la obra social.",
      });
    }
    // Validación extra para consistencia con el booleano de UI
    if (data.tieneObraSocial && !tieneNombre && !tieneNumero) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["nombreObraSocial"], // Marcamos el error en el nombre por defecto
            message: "Debe completar los datos de la obra social.",
          });
    }
  }
});

export const REGISTRO_INGRESO_DEFAULT_VALUES = {
  cuilPaciente: "",
  nombrePaciente: "",
  apellidoPaciente: "",
  emailPaciente: "",
  calleDomicilio: "",
  numeroDomicilio: 0,
  localidadDomicilio: "",
  tieneObraSocial: false,
  nombreObraSocial: "",
  numeroAfiliado: "",
  informe: "",
  prioridad: undefined, // Se mantiene undefined para obligar a la selección
  temperatura: 0,
  frecuenciaCardiaca: 0,
  frecuenciaRespiratoria: 0,
  tensionSistolica: 0,
  tensionDiastolica: 0,
};

export type RegistroIngresoSchema = z.infer<typeof registroIngresoSchema>;