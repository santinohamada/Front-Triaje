"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Activity, 
  Thermometer, 
  Heart, 
  Timer, 
  AlertCircle 
} from "lucide-react";
import { useColaAtencion } from "@/hooks/ingreso/useColaAtencion";
import { EstadoIngreso } from "@/types/Enums";
import { formatearTiempo, prioridadConfig, timeAgo } from "@/helpers/helpers";

const estadoConfig = {
  [EstadoIngreso.PENDIENTE]: {
    label: "Pendiente",
    color:
      "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950/50 dark:text-slate-400",
  },
  [EstadoIngreso.EN_PROCESO]: {
    label: "En Proceso",
    color:
      "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  },
  [EstadoIngreso.FINALIZADO]: {
    label: "Finalizado",
    color:
      "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
};

export function ListaPacientes() {
  const { data: ingresos = [], isLoading } = useColaAtencion();

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="pb-4 border-b mb-2">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Pacientes en Guardia
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {ingresos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
            <div className="bg-muted/50 p-4 rounded-full">
                <Clock className="h-8 w-8 opacity-50" />
            </div>
            <p>{isLoading ? "Cargando pacientes..." : "La sala de espera está vacía"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ingresos.map((ingreso, index) => {
              const estado = estadoConfig[ingreso.estado as EstadoIngreso];
              console.log(ingreso.nivelEmergencia)
              return (
                <div
                  key={ingreso.id}
                  className="group relative border rounded-xl bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-lg animate-slide-in-left overflow-hidden"
                  style={{ animationDelay: `${index * 75}ms` }}
                > 
                    {/* INDICADOR LATERAL DE PRIORIDAD (Borde coloreado) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${prioridadConfig[ingreso.nivelEmergencia.prioridad].color}`} />

                    <div className="flex flex-col sm:flex-row p-4 pl-5 gap-4">
                        
                        {/* SECCIÓN PRINCIPAL: DATOS PACIENTE */}
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center justify-between sm:justify-start gap-2">
                                <h3 className="font-bold text-lg truncate leading-none">
                                    {ingreso.paciente.nombre}
                                </h3>
                                <Badge variant="outline" className="sm:hidden text-[10px]">
                                    {ingreso.nivelEmergencia.prioridad}
                                </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                    {ingreso.paciente.cuil}
                                </span>
                                <span className="text-border">|</span>
                                <span className={`${estado.color} text-[10px] px-2 py-0.5 rounded-full font-medium border`}>
                                    {estado.label}
                                </span>
                            </p>

                            {/* SIGNOS VITALES COMPACTOS */}
                            <div className="flex flex-wrap gap-3 pt-1">
                                {ingreso.temperatura > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs bg-muted/30 px-2 py-1 rounded-md text-muted-foreground border border-transparent hover:border-border transition-colors">
                                        <Thermometer className="h-3.5 w-3.5" />
                                        <span>{ingreso.temperatura}°C</span>
                                    </div>
                                )}
                                {ingreso.frecuenciaCardiaca > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs bg-muted/30 px-2 py-1 rounded-md text-muted-foreground border border-transparent hover:border-border transition-colors">
                                        <Heart className="h-3.5 w-3.5" />
                                        <span>{ingreso.frecuenciaCardiaca} lpm</span>
                                    </div>
                                )}
                                {ingreso.tensionArterial && (
                                    <div className="flex items-center gap-1.5 text-xs bg-muted/30 px-2 py-1 rounded-md text-muted-foreground border border-transparent hover:border-border transition-colors">
                                        <Activity className="h-3.5 w-3.5" />
                                        <span>{ingreso.tensionArterial} mmHg</span>
                                    </div>
                                )}
                            </div>
                            
                            {ingreso.informe && (
                                <p className="text-sm text-muted-foreground/80 line-clamp-1 italic pt-1 border-l-2 border-muted pl-2 mt-1">
                                    "{ingreso.informe}"
                                </p>
                            )}
                        </div>

                        {/* SECCIÓN DERECHA: TIEMPO (agrupada para comparar) */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1 sm:border-l sm:pl-4 sm:min-w-[140px]">
                            
                            {/* Prioridad Visible en Desktop */}
                            <Badge 
                                variant="outline" 
                                className={`hidden sm:inline-flex mb-2 ${ingreso.nivelEmergencia.color}`}
                            >
                                {ingreso.nivelEmergencia.prioridad}
                            </Badge>

                            {/* BLOQUE DE TIEMPOS */}
                            <div className="flex flex-col items-start sm:items-end text-right">
                                {/* Tiempo Transcurrido (Más grande) */}
                                <div className="flex items-center gap-1.5">
                                    <Timer className="h-4 w-4 text-primary/70" />
                                    <span className="text-sm font-semibold">
                                        {timeAgo(ingreso.fechaIngreso)}
                                    </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    En espera
                                </span>
                            </div>

                            {/* Tiempo Máximo (Referencia) */}
                            {ingreso.nivelEmergencia.tiempoMaximo !== undefined && (
                                <div className="flex flex-col items-end mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-dashed border-muted-foreground/20 w-full">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>
                                            MAX: {formatearTiempo(ingreso.nivelEmergencia.tiempoMaximo)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}