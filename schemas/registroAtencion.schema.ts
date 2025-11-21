import { z } from "zod";

export const registroAtencionSchema = z.object({
  observaciones: z.string().min(1, { message: "Las observaciones son obligatorias" }),
  diagnosticoPresuntivo: z.string().min(1, { message: "El diagnóstico presuntivo es obligatorio" }),
  procedimientoRealizado: z.string().min(1, { message: "El procedimiento realizado es obligatorio" }),
  ingresoId: z.string().min(1, { message: "El ID de ingreso es obligatorio" }),
});

export const REGISTRO_ATENCION_DEFAULT_VALUES = {
  observaciones: "",
  diagnosticoPresuntivo: "",
  procedimientoRealizado: "",
  ingresoId: ""
};

export type RegistroAtencionSchema = z.infer<typeof registroAtencionSchema>;