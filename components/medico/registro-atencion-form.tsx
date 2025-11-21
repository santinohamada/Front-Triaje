"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Clock,
  Activity,
  Thermometer,
  Heart,
  CheckCircle2,
  User,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { PrioridadTriaje } from "@/types/Enums";
import { Ingreso } from "@/types/paciente.types";
import { RegistroAtencionDto } from "@/dto/atencion.dto";
import { 
  REGISTRO_ATENCION_DEFAULT_VALUES,
  registroAtencionSchema, 
  RegistroAtencionSchema 
} from "@/schemas/registroAtencion.schema";
import { formatearTiempo, prioridadConfig } from "@/helpers/helpers";

interface RegistroAtencionFormProps {
  ingreso: Ingreso;
  onFinalizarAtencion: (data: RegistroAtencionDto) => Promise<boolean>;
}

export function RegistroAtencionForm({
  ingreso,
  onFinalizarAtencion,
}: RegistroAtencionFormProps) {
  const [finalizando, setFinalizando] = useState(false);

  const form = useForm<RegistroAtencionSchema>({
    resolver: zodResolver(registroAtencionSchema),
    defaultValues: {
      ...REGISTRO_ATENCION_DEFAULT_VALUES,
      ingresoId: ingreso.id.toString(),
    },
  });

  const onSubmit = async (data: RegistroAtencionSchema) => {
    setFinalizando(true);

    try {
      const success = await onFinalizarAtencion(data as RegistroAtencionDto);

      if (success) {
        toast.success("Atención finalizada correctamente");
        form.reset();
      } else {
        toast.error("Error al guardar la atención");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al finalizar");
    } finally {
      setFinalizando(false);
    }
  };

  const prioridad = prioridadConfig[ingreso.nivelEmergencia.prioridad];

  return (
    <Card className="border-2 border-primary shadow-lg animate-scale-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xl sm:text-2xl">
            Paciente en Atención
          </CardTitle>

          <Badge className={`${prioridad.color} transition-colors duration-200 w-fit`}>
            {prioridad.label}
          </Badge>
        </div>

        <CardDescription>
          Complete la historia clínica para finalizar la atención
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ► Datos del paciente */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5" />
                {ingreso.paciente.nombre}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">CUIL:</span>
                  <span className="text-muted-foreground">{ingreso.paciente.cuil}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">Afiliado:</span>
                  <span className="text-muted-foreground">
                    {ingreso.paciente.afiliado?.numeroAfiliado || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {typeof ingreso.nivelEmergencia.tiempoMaximoMinutos === "number" && (
              <div className="flex items-center gap-2 text-sm bg-background px-4 py-3 rounded-md border w-fit">
                <Clock className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <p className="text-xs text-muted-foreground">Tiempo de espera</p>
                  <p className="font-bold">
                    {formatearTiempo(ingreso.nivelEmergencia.tiempoMaximoMinutos)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ► Motivo y signos vitales */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Motivo de Ingreso</h4>
            <div className="text-sm bg-muted p-3 rounded-md leading-relaxed h-full border">
              {ingreso.informe}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Signos Vitales (Triaje)</h4>

            <div className="grid grid-cols-2 gap-3">
              {ingreso.temperatura > 0 && (
                <Signo label="Temperatura" value={`${ingreso.temperatura}°C`}>
                  <Thermometer className="h-4 w-4" />
                </Signo>
              )}

              {ingreso.frecuenciaCardiaca > 0 && (
                <Signo label="FC" value={`${ingreso.frecuenciaCardiaca} lpm`}>
                  <Heart className="h-4 w-4" />
                </Signo>
              )}

              {ingreso.frecuenciaRespiratoria > 0 && (
                <Signo label="FR" value={`${ingreso.frecuenciaRespiratoria} rpm`}>
                  <Activity className="h-4 w-4" />
                </Signo>
              )}

              {ingreso.tensionArterial && (
                <Signo label="TA" value={`${ingreso.tensionArterial} mm/hg`}>
                  <Activity className="h-4 w-4" />
                </Signo>
              )}
            </div>
          </div>
        </div>

        {/* ► Formulario Zod */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Registro Clínico</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Diagnóstico Presuntivo */}
              <FormField
                control={form.control}
                name="diagnosticoPresuntivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnóstico Presuntivo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa el diagnóstico principal..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Procedimiento */}
              <FormField
                control={form.control}
                name="procedimientoRealizado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procedimiento Realizado</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalle los procedimientos efectuados..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Observaciones */}
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones Generales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales, indicaciones al alta, etc..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={finalizando}
                size="lg"
                className="w-full gap-2 mt-4 transition-all duration-200 hover:scale-[1.01]"
              >
                {finalizando ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Finalizando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Finalizar Atención
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

function Signo({
  label,
  value,
  children,
}: {
  label: string;
  value: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted rounded-lg p-2 space-y-1 flex items-center justify-between border sm:block">
      <div className="flex items-center gap-2 text-muted-foreground">
        {children}
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="text-sm sm:text-lg font-bold">{value}</p>
    </div>
  );
}
