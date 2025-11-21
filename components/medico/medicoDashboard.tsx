"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCheck, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { RegistroAtencionForm } from "./registro-atencion-form"
import { EstadoIngreso, PrioridadTriaje } from "@/types/Enums"
import { Ingreso } from "@/types/paciente.types"
import { ReclamarSiguienteResponse, RegistroAtencionDto } from "@/dto/atencion.dto"

import { useColaAtencion } from "@/hooks/ingreso/useColaAtencion"
import { useReclamarSiguiente } from "@/hooks/atencion/useReclamarSiguiente"
import { useRegistrarAtencion } from "@/hooks/atencion/useReclamarAtencion"
import { ListaPacientes } from "../lista-pacientes"

const PACIENTE_ACTIVO_STORAGE_KEY = "medico_paciente_activo"

const mapReclamoToIngreso = (data: ReclamarSiguienteResponse): Ingreso => {
  return {
    id: data.id,
    fechaIngreso: data.fechaIngreso,
    informe: data.informe || "",
    estado: EstadoIngreso.EN_PROCESO,

    nivelEmergencia: {
      prioridad: data.nivelEmergencia as unknown as PrioridadTriaje,
      color: data.color,
      tiempoMaximoMinutos: data.tiempoMaximoMinutos,
    },

    temperatura: data.temperatura || 0,
    frecuenciaCardiaca: data.frecuenciaCardiaca || 0,
    frecuenciaRespiratoria: data.frecuenciaRespiratoria || 0,
    tensionArterial: data.tensionArterial || "120/80",

    paciente: {
      id: "",
      cuil: data.pacienteCuil,
      nombre: data.pacienteNombre,
    },

    enfermero: {
      id: "",
      matricula: data.enfermeroMatricula,
      nombre: data.enfermeroNombre,
      cuil: "",
    },

    fechaCreacion: data.fechaIngreso,
  }
}

export function MedicoDashboard() {
  const [ingresoActivo, setIngresoActivo] = useState<Ingreso | null>(null)
  const [error, setError] = useState("")
  const [isRestoring, setIsRestoring] = useState(true)

  const { data: ingresos, refetch: refetchCola } = useColaAtencion()
  const { mutateAsync: reclamarSiguiente, isPending: isReclamando } = useReclamarSiguiente()
  const { mutateAsync: registrarAtencion } = useRegistrarAtencion()

  useEffect(() => {
    const storedData = localStorage.getItem(PACIENTE_ACTIVO_STORAGE_KEY)
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setIngresoActivo(parsedData)

        toast.info("Se restauró la sesión de atención pendiente.")
      } catch {
        localStorage.removeItem(PACIENTE_ACTIVO_STORAGE_KEY)
      }
    }
    setIsRestoring(false)
  }, [])

  useEffect(() => {
    if (ingresoActivo) {
      localStorage.setItem(PACIENTE_ACTIVO_STORAGE_KEY, JSON.stringify(ingresoActivo))
    }
  }, [ingresoActivo])

  const handleReclamarPaciente = async () => {
    setError("")
    try {
      const respuestaBackend = await reclamarSiguiente()

      if (respuestaBackend) {
        const ingresoMapeado = mapReclamoToIngreso(respuestaBackend as ReclamarSiguienteResponse)
        setIngresoActivo(ingresoMapeado)

        toast.success("Paciente asignado correctamente")
        await refetchCola()
      } else {
        setError("No se pudo asignar un paciente.")
      }
    } catch {
      setError("Error al reclamar paciente o no hay pacientes en cola.")
    }
  }

  const handleFinalizarAtencion = async (data: RegistroAtencionDto): Promise<boolean> => {
    try {
      if (ingresoActivo) {
        data.ingresoId = ingresoActivo.id
      }

      await registrarAtencion(data)

      toast.success("Atención finalizada correctamente")

      localStorage.removeItem(PACIENTE_ACTIVO_STORAGE_KEY)
      setIngresoActivo(null)

      await refetchCola()
      return true
    } catch {
      toast.error("Error al finalizar la atención")
      return false
    }
  }

  if (isRestoring) return null

  if (!ingresos) return <div className="p-4 text-center animate-pulse">Cargando pacientes...</div>

  const pacientesPendientes = ingresos.filter((i) => i.estado === EstadoIngreso.PENDIENTE)

  return (
    <div className="space-y-4 sm:space-y-6">
      {ingresoActivo ? (
        <RegistroAtencionForm ingreso={ingresoActivo} onFinalizarAtencion={handleFinalizarAtencion} />
      ) : (
        <Card className="border-dashed border-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
            <CardTitle className="text-lg sm:text-xl text-muted-foreground">Área de Trabajo</CardTitle>

            <Button
              onClick={handleReclamarPaciente}
              disabled={isReclamando || pacientesPendientes.length === 0}
              size="lg"
              className="gap-2 w-full sm:w-auto shadow-md"
            >
              <UserCheck className="h-5 w-5" />
              {isReclamando ? "Asignando..." : "Llamar Siguiente Paciente"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {pacientesPendientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground bg-accent/10 rounded-lg">
                <p>No hay pacientes pendientes para llamar.</p>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg p-4">
                <p className="text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">
                  Cola Activa: {pacientesPendientes.length} paciente
                  {pacientesPendientes.length !== 1 ? "s" : ""} esperando.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ListaPacientes />
    </div>
  )
}
