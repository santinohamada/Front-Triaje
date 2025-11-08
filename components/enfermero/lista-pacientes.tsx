"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Ingreso, PrioridadTriaje, EstadoIngreso } from "@/lib/types"
import { Clock, Activity, Thermometer, Heart } from "lucide-react"

interface ListaPacientesProps {
  ingresos: Ingreso[]
}

const prioridadConfig = {
  [PrioridadTriaje.Critico]: {
    label: "Crítico",
    color: "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  },
  [PrioridadTriaje.Emergencia]: {
    label: "Emergencia",
    color: "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  },
  [PrioridadTriaje.Urgencia]: {
    label: "Urgencia",
    color: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  },
  [PrioridadTriaje.UrgenciaMenor]: {
    label: "Urgencia Menor",
    color: "border-lime-500 bg-lime-50 text-lime-700 dark:bg-lime-950/50 dark:text-lime-400",
  },
  [PrioridadTriaje.SinUrgencia]: {
    label: "Sin Urgencia",
    color: "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400",
  },
}

const estadoConfig = {
  [EstadoIngreso.PENDIENTE]: {
    label: "Pendiente",
    color: "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950/50 dark:text-slate-400",
  },
  [EstadoIngreso.EN_PROCESO]: {
    label: "En Proceso",
    color: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  },
  [EstadoIngreso.FINALIZADO]: {
    label: "Finalizado",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
}

export function ListaPacientes({ ingresos }: ListaPacientesProps) {
  const formatearTiempo = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos} min`
    }
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas}h ${mins}m`
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Listado de Pacientes en Guardia</CardTitle>
      </CardHeader>
      <CardContent>
        {ingresos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay pacientes registrados en este momento</p>
        ) : (
          <div className="space-y-3">
            {ingresos.map((ingreso, index) => {
              const prioridad = prioridadConfig[ingreso.prioridad]
              const estado = estadoConfig[ingreso.estado]

              return (
                <div
                  key={ingreso.id}
                  className="border rounded-lg p-3 sm:p-4 space-y-3 hover:shadow-md hover:border-foreground/20 transition-all duration-300 animate-slide-in-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{ingreso.paciente.nombreCompleto}</h3>
                        <Badge variant="outline" className={`${prioridad.color} border transition-colors duration-200`}>
                          {prioridad.label}
                        </Badge>
                        <Badge variant="outline" className={`${estado.color} border transition-colors duration-200`}>
                          {estado.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground break-words">
                        DNI: {ingreso.paciente.dni} | Afiliado: {ingreso.paciente.numeroAfiliado}
                      </p>
                    </div>
                    {ingreso.tiempoEspera !== undefined && (
                      <div className="flex items-center gap-1 text-sm bg-muted px-3 py-1 rounded-full shrink-0 w-fit">
                        <Clock className="h-4 w-4 animate-pulse" />
                        <span className="font-medium whitespace-nowrap">{formatearTiempo(ingreso.tiempoEspera)}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed line-clamp-2">{ingreso.informe}</p>

                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 text-sm">
                    {ingreso.temperatura && (
                      <div className="flex items-center gap-1 transition-transform hover:scale-110">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span>{ingreso.temperatura}°C</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 transition-transform hover:scale-110">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{ingreso.frecuenciaCardiaca} lpm</span>
                    </div>
                    <div className="flex items-center gap-1 transition-transform hover:scale-110">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span>{ingreso.frecuenciaRespiratoria} rpm</span>
                    </div>
                    <div className="flex items-center gap-1 transition-transform hover:scale-110">
                      <span className="text-muted-foreground">TA:</span>
                      <span>{ingreso.tensionArterial}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Ingreso: {new Date(ingreso.fechaIngreso).toLocaleString("es-AR")}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
