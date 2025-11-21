"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useRegister } from "@/hooks/auth/useRegister";

import {
  User,
  Lock,
  Mail,
  FileText,
  AlertCircle,
  ArrowLeft,
  BadgeIndianRupeeIcon
} from "lucide-react";

import { Rol } from "@/types/Enums";
import {
  REGISTRAR_USUARIO_DEFAULT_VALUES,
  RegistrarUsuarioFormData,
  registrarUsuarioSchema
} from "@/schemas/registrarUsuario.schema";

import { toastUtils } from "./toastUtils";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rolParam = searchParams.get("rol");

  const rol =
    rolParam === Rol.Medico || rolParam === Rol.Enfermero
      ? rolParam
      : "Enfermero";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegistrarUsuarioFormData>({
    resolver: zodResolver(registrarUsuarioSchema),
    defaultValues: REGISTRAR_USUARIO_DEFAULT_VALUES
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: RegistrarUsuarioFormData) => {
    try {
      const res = await registerMutation.mutateAsync({
        dto: data,
        rol: rol
      });

      if (res.esExitoso) {
        toastUtils.success("Registro exitoso", "El usuario fue creado correctamente.");
        router.push("/");
      } else {
        toastUtils.showApiError(res.errores || res.mensaje);
      }
    } catch (error) {
      console.error("Error en registro", error);
      toastUtils.showApiError(error);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Registro de {rol}</CardTitle>
        <CardDescription>
          Complete los datos para crear su cuenta profesional
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nombre"
                  placeholder="Juan"
                  className={`pl-10 ${errors.nombre ? "border-destructive" : ""}`}
                  {...register("nombre")}
                />
              </div>
              {errors.nombre && (
                <span className="text-xs text-destructive">{errors.nombre.message}</span>
              )}
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="apellido"
                  placeholder="Pérez"
                  className={`pl-10 ${errors.apellido ? "border-destructive" : ""}`}
                  {...register("apellido")}
                />
              </div>
              {errors.apellido && (
                <span className="text-xs text-destructive">{errors.apellido.message}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="correo@hospital.com"
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-destructive">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="******"
                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-xs text-destructive">{errors.password.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Matrícula */}
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <div className="relative">
                <BadgeIndianRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="matricula"
                  placeholder="MP-1234"
                  className={`pl-10 ${errors.matricula ? "border-destructive" : ""}`}
                  {...register("matricula")}
                />
              </div>
              {errors.matricula && (
                <span className="text-xs text-destructive">{errors.matricula.message}</span>
              )}
            </div>

            {/* CUIL */}
            <div className="space-y-2">
              <Label htmlFor="cuil">CUIL</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cuil"
                  placeholder="20-123..."
                  className={`pl-10 ${errors.cuil ? "border-destructive" : ""}`}
                  {...register("cuil")}
                />
              </div>
              {errors.cuil && (
                <span className="text-xs text-destructive">{errors.cuil.message}</span>
              )}
            </div>
          </div>

          {/* Error general del servidor */}
          {(registerMutation.isError ||
            (registerMutation.data && !registerMutation.data.esExitoso)) && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {registerMutation.data?.mensaje || "Error al registrar usuario"}
              </span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isSubmitting || registerMutation.isPending}
          >
            {isSubmitting || registerMutation.isPending
              ? "Registrando..."
              : `Registrar ${rol}`}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4 bg-muted/20">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </CardFooter>
    </Card>
  );
}
