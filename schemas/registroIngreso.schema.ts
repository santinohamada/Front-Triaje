import { z } from "zod";
import { PrioridadTriaje } from "@/types/Enums";

export const registroIngresoSchema = z.object({
  cuilPaciente: z.string().min(1, "El CUIL es requerido"),
  nombrePaciente: z.string().min(1, "El nombre es requerido"),
  apellidoPaciente: z.string().min(1, "El apellido es requerido"),
  emailPaciente: z.string().email("Email inválido"),
  
  // Domicilio
  calleDomicilio: z.string().min(1, "La calle es requerida"),
  numeroDomicilio: z.coerce.number().min(1, "Número inválido"),
  localidadDomicilio: z.string().min(1, "La localidad es requerida"),

  // Obra Social (Lógica condicional)
  tieneObraSocial: z.boolean().default(false),
  nombreObraSocial: z.string().optional(),
  numeroAfiliado: z.string().optional(),

  // Triaje y Signos Vitales
  prioridad: z.nativeEnum(PrioridadTriaje, {
    errorMap: () => ({ message: "Seleccione una prioridad" }),
  }),
  temperatura: z.coerce.number().min(30, "Valor irreal").max(45, "Valor irreal"),
  frecuenciaCardiaca: z.coerce.number().min(1, "Requerido"),
  frecuenciaRespiratoria: z.coerce.number().min(1, "Requerido"),
  tensionSistolica: z.coerce.number().min(1, "Requerido"),
  tensionDiastolica: z.coerce.number().min(1, "Requerido"),
  informe: z.string().min(10, "El informe debe ser más detallado"),
}).superRefine((data, ctx) => {
  if (data.tieneObraSocial) {
    if (!data.nombreObraSocial || data.nombreObraSocial.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nombreObraSocial"],
        message: "Requerido si tiene obra social",
      });
    }
    if (!data.numeroAfiliado || data.numeroAfiliado.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numeroAfiliado"],
        message: "Requerido si tiene obra social",
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
  prioridad: undefined,
  temperatura: 0,
  frecuenciaCardiaca: 0,
  frecuenciaRespiratoria: 0,
  tensionSistolica: 0,
  tensionDiastolica: 0,
}
export type RegistroIngresoSchema = z.infer<typeof registroIngresoSchema>;