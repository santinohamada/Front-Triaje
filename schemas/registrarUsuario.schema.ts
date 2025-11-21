import { z } from "zod";

export const registrarUsuarioSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  apellido: z.string().min(1, { message: "El apellido es obligatorio" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  matricula: z.string().min(1, { message: "La matrícula es obligatoria" }),
  cuil: z.string()
    .min(1, { message: "El CUIL es obligatorio" })
    .regex(/^\d+$/, { message: "El CUIL solo puede contener números" })
    .min(10, { message: "El CUIL debe tener al menos 10 dígitos" })
    .max(11, { message: "El CUIL no puede tener más de 11 dígitos" }),
});

export const REGISTRAR_USUARIO_DEFAULT_VALUES = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  matricula: "",
  cuil: ""
};

export type RegistrarUsuarioFormData = z.infer<typeof registrarUsuarioSchema>;