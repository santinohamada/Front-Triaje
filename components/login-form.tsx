"use client";

import { useRouter } from "next/navigation";
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
  CardFooter,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/auth/useLogin";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { setSession } from "@/lib/authStorage";
import { LoginFormData, loginSchema } from "@/schemas/LogIn.Schema";

import { toastUtils } from "./toastUtils";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password
      });

      if (res.esExitoso) {
        toastUtils.success("Ingreso exitoso", "Redirigiendo al panel…");

        setSession(res.token ?? "", {
          email: data.email,
          rol: res.rol || "",
        });

        router.push(`/dashboard/${res.rol?.toLocaleLowerCase()}`);
      } else {
        toastUtils.showApiError(res.mensaje);
      }
    } catch (error) {
      console.error(error);
      toastUtils.showApiError(error);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          Sistema de Guardia Hospitalaria
        </CardTitle>
        <CardDescription>
          Ingrese sus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nombre@hospital.com"
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
                placeholder="Ingrese su contraseña"
                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-xs text-destructive">{errors.password.message}</span>
            )}
          </div>

          {/* Error del servidor */}
          {(loginMutation.isError ||
            (loginMutation.data && !loginMutation.data.esExitoso)) && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loginMutation.data?.mensaje || "Credenciales inválidas"}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

      </CardContent>

      <CardFooter className="flex flex-col space-y-2 border-t pt-4 bg-muted/20">
        <p className="text-sm text-muted-foreground">¿No tienes cuenta?</p>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/registrar?rol=Medico" className="text-primary hover:underline">
            Registrar Médico
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link href="/registrar?rol=Enfermero" className="text-primary hover:underline">
            Registrar Enfermero
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
