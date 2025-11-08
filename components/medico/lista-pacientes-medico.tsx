"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Ingreso, PrioridadTriaje, EstadoIngreso } from "@/lib/types"
import { useIngresos } from "@/hooks/use-ingresos"
import { Clock, Activity, Thermometer, Heart, UserCheck, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AtencionPaciente } from "./atencion-paciente"

interface ListaPacientesMedicoProps {
  ingresoActual: Ingreso | null
  ingresosPrevios: Ingreso[]
  onReclamarPaciente: () => Promise<Ingreso | null>
  onFinalizarAtencion: (ingresoId: string, informeMedico: string) => Promise<boolean>
  medicoId: string
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

export function ListaPacientesMedico({
  ingresoActual,
  ingresosPrevios,
  onReclamarPaciente,
  onFinalizarAtencion,
  medicoId,
}: ListaPacientesMedicoProps) {
  const [reclamando, setReclamando] = useState(false)
  const [error, setError] = useState("")
  const { ingresos } = useIngresos()

  const formatearTiempo = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos} min`
    }
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas}h ${mins}m`
  }

  const handleReclamarPaciente = async () => {
    setReclamando(true)
    setError("")
    try {
      const ingreso = await onReclamarPaciente()
      if (!ingreso) {
        setError("No hay pacientes disponibles para reclamar")
      }
    } catch (error) {
      setError("Error al reclamar paciente")
    } finally {
      setReclamando(false)
    }
  }

  const pacientesPendientes = ingresos.filter((i) => i.estado === EstadoIngreso.PENDIENTE)

  return (
    <div className="space-y-4 sm:space-y-6">
      {ingresoActual ? (
        <AtencionPaciente ingreso={ingresoActual} onFinalizarAtencion={onFinalizarAtencion} />
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
            <CardTitle className="text-lg sm:text-xl">Reclamar Paciente</CardTitle>
            <Button
              onClick={handleReclamarPaciente}
              disabled={reclamando || pacientesPendientes.length === 0}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <UserCheck className="h-5 w-5" />
              {reclamando ? "Reclamando..." : "Reclamar Siguiente Paciente"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {pacientesPendientes.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay pacientes pendientes en este momento</p>
            ) : (
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">
                  Hay {pacientesPendientes.length} paciente{pacientesPendientes.length !== 1 ? "s" : ""} esperando
                  atención
                </p>
                <p className="text-xs text-muted-foreground">
                  Al presionar el botón, se le asignará automáticamente el paciente con mayor prioridad y mayor tiempo
                  de espera
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Todos los Pacientes en Guardia</CardTitle>
        </CardHeader>
        <CardContent>
          {ingresos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay pacientes en guardia en este momento</p>
          ) : (
            <div className="space-y-3">
              {ingresos.map((ingreso) => {
                const prioridad = prioridadConfig[ingreso.prioridad]
                const estado = estadoConfig[ingreso.estado]
                const esMiPaciente = ingreso.medicoId === medicoId

                return (
                  <div
                    key={ingreso.id}
                    className={`border rounded-lg p-3 sm:p-4 space-y-3 hover:bg-accent/30 transition-colors ${
                      esMiPaciente && ingreso.estado === EstadoIngreso.EN_PROCESO ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold truncate">{ingreso.paciente.nombreCompleto}</h3>
                          <Badge variant="outline" className={`${prioridad.color} border`}>
                            {prioridad.label}
                          </Badge>
                          <Badge variant="outline" className={`${estado.color} border`}>
                            {estado.label}
                          </Badge>
                          {esMiPaciente && ingreso.estado === EstadoIngreso.EN_PROCESO && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                              Mi Paciente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground break-words">
                          DNI: {ingreso.paciente.dni} | Afiliado: {ingreso.paciente.numeroAfiliado}
                        </p>
                      </div>
                      {ingreso.tiempoEspera !== undefined && ingreso.estado !== EstadoIngreso.FINALIZADO && (
                        <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{formatearTiempo(ingreso.tiempoEspera)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm line-clamp-2">{ingreso.informe}</p>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 text-sm">
                      {ingreso.temperatura && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span>{ingreso.temperatura}°C</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>{ingreso.frecuenciaCardiaca} lpm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>{ingreso.frecuenciaRespiratoria} rpm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">TA:</span>
                        <span>{ingreso.tensionArterial}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
